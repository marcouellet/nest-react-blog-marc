import { ImageData, IAuthToken } from '../interfaces';
import { UserRole } from '../enum';
export declare class User {
    id?: string;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    image?: ImageData;
}
export declare class AuthenticatedUser extends User {
    authtoken?: IAuthToken;
    authrefreshtoken?: IAuthToken;
}
export declare const minimumUserNameLength = 2;
export declare const minimumUserEmailLength = 10;
export declare const minimumUserPasswordLength = 3;
