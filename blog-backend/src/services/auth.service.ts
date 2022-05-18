import { toMs }from 'ms-typescript'
import { bcrypt } from 'bcryptjs';
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as JwtPayload;
      if (!decoded) {
        throw new Error();
      }
      const {sub} = decoded;
      const user = await this.userService.findUser({email: sub});
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      // const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.authrefreshtoken);
      // if (!isRefreshTokenMatching) {
      //   throw new UnauthorizedException('Invalid token');
      // }
      // return this.jwtService.verifyAsync<IAuthToken>(refreshToken, this.getRefreshTokenOptions())
      // .then(() => {
      //   user.authtoken = this.createToken(user);
      //   user.authrefreshtoken = this.createRefreshToken(user);
      //   return user; 
      // });
      user.authtoken = this.createToken(user);
      user.authrefreshtoken = this.createRefreshToken(user);
      return user;

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
      : Promise.reject( new ForbiddenException('Access Denied') )
    })
    .catch(err => Promise.reject(err))
   }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    registerDto.password = this.cryptoService.hashPassword(registerDto.password)
    return this.userService.createUser(registerDto);
  }

  async refresh(refreshDto: RefreshDto): Promise<UserDto> {
    return this.createAccessTokenFromRefreshToken(refreshDto.authrefreshtoken.accessToken);
  }
}


