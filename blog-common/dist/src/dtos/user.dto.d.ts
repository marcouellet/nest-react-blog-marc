import { UserRole } from '../enum';
import { IAuthToken } from '../interfaces/jwt.interface';
import { ImageData } from '../interfaces';
export declare class UserDto {
    id?: string;
    username: string;
    email: string;
    password?: string;
    role?: UserRole;
    image?: ImageData;
    authtoken?: IAuthToken;
    authrefreshtoken?: IAuthToken;
}
