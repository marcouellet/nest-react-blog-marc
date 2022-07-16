export class IAuthToken {
  accessToken: any;
}
export interface JwtPayload {
  sub: string;
  expiresIn: number;
}
