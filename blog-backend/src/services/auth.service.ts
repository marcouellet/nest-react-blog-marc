import { Injectable, ForbiddenException } from '@nestjs/common';
import { LoginDto, RegisterDto, UserDto, RefreshDto } from '../core/dtos';
import { ConfigService } from '../services/config.service';
import { UserService } from '../services/user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt.interface';
import { IAuthToken } from '../auth/interfaces/auth-token.interface';
import { CryptographerService } from './cryptographer.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptographerService,
  ) {}

  private createToken({ email }: UserDto): IAuthToken {
    const sub = email;
    const payload: JwtPayload = { sub };
    const accessToken = this.jwtService.sign(payload, this.getTokenSignOptions());
    return { accessToken } as IAuthToken;
  }

  private getTokenSignOptions() {
    const options: JwtSignOptions = {
      secret: this.configService.getConfig().authSecretKey,
    };
    const expiration: string = this.configService.getConfig().authExpiresIn;
    if (expiration) {
      options.expiresIn = expiration;
    }
    return options;
  }

  private createRefreshToken({ email }: UserDto): IAuthToken {
    const sub = email;
    const payload: JwtPayload = { sub };
    const accessToken = this.jwtService.sign(payload, this.getRefreshTokenSignOptions());
    return { accessToken } as IAuthToken;
  }

  private getRefreshTokenSignOptions() {
    const options: JwtSignOptions = {
      secret: this.configService.getConfig().authRefreshTokenSecretKey,
    };
    const expiration: string = this.configService.getConfig().authRefreshTokenExpiresIn;
    if (expiration) {
      options.expiresIn = expiration;
    }
    return options;
  }

  async getUserFromToken(token: string): Promise<UserDto> {
    try {
      const decodedjwt: any = this.jwtService.decode(token);
      if (!decodedjwt) {
        throw  new ForbiddenException('Access Denied');
      }
      const currenttime = Date.now().valueOf() / 1000;
      if (decodedjwt.exp < currenttime) {
        throw  new ForbiddenException('Access Denied');
      }

      const {sub} = decodedjwt;
      return this.userService.findUser({email: sub});
     } catch {
      throw  new ForbiddenException('Access Denied');
    }
  }

  async whoAmI(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);

  }

  async findUserByPayload(payload: JwtPayload): Promise<UserDto> {
    const {sub} = payload;
    return this.userService.findUser({email: sub});
  }

  async validateUser(criterias: {}): Promise<UserDto> {
    return this.userService.findUser(criterias);
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    const { email, password } = loginDto;
    return this.userService.findUserUnrestricted({ email })
    .then(async user => {
      return this.cryptoService.checkPassword(user.password, password)
      ? (usr => {
        usr.authtoken = this.createToken(user);
        usr.authrefreshtoken = this.createRefreshToken(user);
        delete usr.password;
        return Promise.resolve(usr);
      })(user)
      : Promise.reject( new ForbiddenException('Access Denied') );
    })
    .catch(err => Promise.reject(err));
   }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    registerDto.password = this.cryptoService.hashPassword(registerDto.password);
    return this.userService.createUser(registerDto);
  }

  async refresh(refreshDto: RefreshDto): Promise<UserDto> {
    return this.getUserFromToken(refreshDto.authtoken.accessToken)
      .then(user => {
        user.authtoken = this.createToken(user);
        user.authrefreshtoken = this.createRefreshToken(user);
        delete user.password;
        return user;
      });
  }
}
