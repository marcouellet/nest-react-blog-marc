export class IAuthToken {
    accessToken: any;
}

export type JWTPayload = {
sub: string;
exp: number;
expiresIn: number;
}
