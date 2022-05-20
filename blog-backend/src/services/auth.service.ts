import { Injectable, ForbiddenException, NotFoundException, InternalServerErrorException, HttpStatus, HttpException } from '@nestjs/common';
import { LoginDto, RegisterDto, UserDto, RefreshDto } from '../core/dtos';
import { ConfigService } from '../services/config.service';
import { UserService } from '../services/user/user.service';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
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

  private setupUserWithNewTokens(user: UserDto): UserDto {
    user.authtoken = this.createToken(user);
    user.authrefreshtoken = this.createRefreshToken(user);
    delete user.password;
    return user;
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

  private getRefreshTokenVerifyOptions() {
    const options: JwtVerifyOptions = {
      secret: this.configService.getConfig().authRefreshTokenSecretKey,
    };
    return options;
  }

  async validateRefreshToken(token: string): Promise<JwtPayload> {
      return this.jwtService.verifyAsync<JwtPayload>(token, this.getRefreshTokenVerifyOptions())
        .catch(_ => { throw new ForbiddenException('Access Denied'); });
  }

  async getUserFromToken(token: string): Promise<UserDto> {
    try {
      const decodedjwt: any = this.jwtService.decode(token);
      if (!decodedjwt) {
        throw  new ForbiddenException('Access Denied');
      }
      const {sub} = decodedjwt;
      return this.userService.findUser({email: sub})
        .catch(_ => { throw new NotFoundException('User not found'); });
     } catch {
      throw  new ForbiddenException('Access Denied');
    }
  }

  async validateToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }

  async findUserByPayload(payload: JwtPayload): Promise<UserDto> {
    const {sub} = payload;
    return this.userService.findUser({email: sub})
      .catch(_ => { throw new NotFoundException('User not found'); });
  }

  async validateUser(criterias: {}): Promise<UserDto> {
    return this.userService.findUser(criterias)
      .catch(_ => { throw new NotFoundException('User not found'); });
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    const { email, password } = loginDto;
    return this.userService.findUserUnrestricted({ email })
      .then(user => {
        if (this.cryptoService.checkPassword(user.password, password)) {
          return this.setupUserWithNewTokens(user);
        } else {
          throw new ForbiddenException('Access Denied');
        }
      })
      .catch(error => { 
        if ((error instanceof HttpException) && (error.getStatus() != HttpStatus.FORBIDDEN)) {
          throw new NotFoundException('User not found');
        }
        throw error;
      });
     }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    registerDto.password = this.cryptoService.hashPassword(registerDto.password);
    return this.userService.createUser(registerDto)
    .catch(_ => { throw new InternalServerErrorException('Cannot create user!'); });
  }

  async refresh(refreshDto: RefreshDto): Promise<UserDto> {
    return this.getUserFromToken(refreshDto.authtoken.accessToken)
      .then(user => this.setupUserWithNewTokens(user))
      .catch(_ => { throw new NotFoundException('User not found'); });
  }
}
