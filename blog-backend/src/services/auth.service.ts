import { toMs }from 'ms-typescript'
import { bcrypt } from 'bcryptjs';
import { Injectable, HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto, UserDto, RefreshDto } from '../core/dtos';
import { ConfigService } from '../services/config.service';
import { UserService } from '../services/user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt.interface';
import { IAuthToken } from '../auth/interfaces/auth-token.interface';
@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private createToken({ email }: UserDto): IAuthToken {
    const sub = email;
    const payload: JwtPayload = { sub };
    const accessToken = this.jwtService.sign(payload /*, this.getTokenOptions() fails*/);
    return { accessToken } as IAuthToken;
  }

  private getTokenOptions() {
    const options: JwtSignOptions = {
      secret: this.configService.getConfig().authExpiresIn
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
    const accessToken = this.jwtService.sign(payload /*, this.getRefreshTokenOptions() fails */);
    return { accessToken } as IAuthToken;
  }

  private getRefreshTokenOptions() {
    const options: JwtSignOptions = {
      secret: this.configService.getConfig().authRefreshTokenSecretKey
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
      const user = await this.userService.findUser({sub});
      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
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
      throw new UnauthorizedException('Invalid token');
    }
}
 
  async whoAmI(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);

  }

  async findUserByPayload(payload: JwtPayload): Promise<UserDto> {
    const {sub} = payload;
    return this.userService.findUser({sub});
  }

  async validateUser(criterias: {}): Promise<UserDto> {
    return this.userService.findUser(criterias);
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    const { email, password } = loginDto;
    return this.userService.findUser({ email, password })
      .then((user) => {
        user.authtoken = this.createToken(user);
        user.authrefreshtoken = this.createRefreshToken(user);
        return user; });
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    return this.userService.createUser(registerDto);
  }

  async refresh(refreshDto: RefreshDto): Promise<UserDto> {
    return this.createAccessTokenFromRefreshToken(refreshDto.authrefreshtoken.accessToken);
  }
}


