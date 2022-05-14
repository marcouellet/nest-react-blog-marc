import { toMs }from 'ms-typescript'
import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto, UserDto } from '../core/dtos';
import { ConfigService } from '../services/config.service';
import { UserService } from '../services/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/payload.interface';
import { IAuthToken } from '../auth/interfaces/auth-token.interface';
import { User } from '../core/entities';
@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private createToken({ email }: UserDto): IAuthToken {
    const expiresIn = toMs(this.configService.getConfig().authExpiresIn);
    const payload: JwtPayload = { email, expiresIn };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken } as IAuthToken;
  }

  async whoAmI(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);

  }

  async findUserByPayload(payload: JwtPayload): Promise<UserDto> {
    const {email} = payload;
    return this.userService.findUser({email});
  }

  async validateUser(criterias: {}): Promise<UserDto> {
    return this.userService.findUser(criterias);
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    const { email, password } = loginDto;
    return this.userService.findUser({ email, password })
      .then((user) => {
        user.authtoken = this.createToken(user);
        return user; });
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    return this.userService.createUser(registerDto);
  }
}


