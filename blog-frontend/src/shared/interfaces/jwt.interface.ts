export class IAuthToken {
  accessToken: any;
}
export interface JwtPayload {
  sub: string;
  exp?: number;
  expiresIn: number;
}
