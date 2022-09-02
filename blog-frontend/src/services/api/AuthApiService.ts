import { AxiosService } from './AxiosService';
import { TokenService } from './TokenService';
import { UserDto, LoginDto, RegisterDto, SessionExtensionDto } from "shared/dtos";
import { IRefresh } from "shared/interfaces";

async function login(email: string, password: string): Promise<UserDto> {
  const loginParms: LoginDto = { email, password }
  return AxiosService.post<UserDto>('/auth/login', loginParms)
    .then(response => {
      TokenService.setUser(response.data);
      return response.data;
    });
}

async function register(username: string, email: string, password: string) : Promise<UserDto> {
  const registerParms: RegisterDto = { username, email, password }
  return AxiosService.post<UserDto>('/auth/register', registerParms)
    .then(response => {
      TokenService.setUser(response.data);
      return response.data;
    });
}

async function refresh() : Promise<UserDto> {
  const user = TokenService.getUser();
  const { authtoken, authrefreshtoken } = user;
  const refreshParms: IRefresh = { authtoken, authrefreshtoken };
  return AxiosService.post<UserDto>('/auth/session/refresh', refreshParms)
    .then(response => {
      TokenService.setUser(response.data);
      return response.data;
    });
}

async function extendUserSession(extension: number) : Promise<UserDto> {
  const sessionExtensionParms: SessionExtensionDto = { extension };
  return AxiosService.post<UserDto>('/auth/session/extend', sessionExtensionParms)
    .then(response => {
      TokenService.setUser(response.data);
      return response.data;
    });
}

async function getUserProfile() : Promise<UserDto> {
  return AxiosService.get<UserDto>('/auth/profile')
    .then(response => response.data);
}

async function updateUserProfile(user: UserDto) : Promise<UserDto> {
  return AxiosService.put<UserDto>('/auth/profile', user)
    .then(response => response.data);
}

function logout() {
  TokenService.removeUser();
}

export const AuthApiService = {login, register, refresh, logout, getUserProfile, updateUserProfile, extendUserSession}

