import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginDto, RegisterDto, UserDto } from '../core/dtos';
import { IConfigService } from '../config/interfaces/config.interface';
import { UserService } from '../services/user/user.service';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtPayload, IAuthToken } from '../auth/interfaces/jwt.interface';
import { CryptographerService } from './cryptographer.service';
import { UserRole } from '../core/enum';
import { UserFindCriterias } from '../core/find-criterias/user.find-criterias';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: IConfigService,
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

  public getTokenVerifyOptions() {
    const options: JwtVerifyOptions = {
      secret: this.configService.getConfig().authSecretKey,
    };
    return options;
  }

  public getRefreshTokenVerifyOptions() {
    const options: JwtVerifyOptions = {
      secret: this.configService.getConfig().authRefreshTokenSecretKey,
    };
    return options;
  }

  async getUserFromToken(token: string): Promise<UserDto> {
      return this.validateToken(token)
        .then(payload => {
          const {sub} = payload;
          return this.validateUser({email: sub});
        });
  }

  async validateToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, this.getTokenVerifyOptions())
    .then (result => {
      let { sub } = result;
      return { sub };
    })
      .catch(_ => { throw new UnauthorizedException('Access Denied'); });
  }

  async validateRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, this.getRefreshTokenVerifyOptions())
      .catch(_ => { throw new UnauthorizedException('Access Denied'); });
  }

  async validateUser(criterias: UserFindCriterias, isAdminRequired: boolean = false): Promise<UserDto> {
    return this.userService.findUser(criterias)
      .then(user => {
        if (isAdminRequired && user.role !== UserRole.ADMIN) {
          throw new UnauthorizedException('Access Denied');
        } else { return user; }
      });
  }

  async validateUserUnrestricted(criterias: UserFindCriterias): Promise<UserDto> {
    return this.userService.findUserUnrestricted(criterias);
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    const { email, password } = loginDto;
    return this.validateUserUnrestricted({ email })
      .then(user => {
        if (this.cryptoService.checkPassword(user.password, password)) {
          return this.setupUserWithNewTokens(user);
        } else {
          throw new UnauthorizedException('Access Denied');
        }
      });
    }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    return this.userService.createUser(registerDto)
    .then(user => this.setupUserWithNewTokens(user));
  }

  async registerAsAdmin(registerDto: RegisterDto): Promise<UserDto> {
    const {username, email, password} = registerDto;
    const role = UserRole.ADMIN;
    let createUserDto: CreateUserDto = {username, email, password, role};
    return this.userService.createUser(createUserDto)
    .then(user => this.setupUserWithNewTokens(user));
  }
}
