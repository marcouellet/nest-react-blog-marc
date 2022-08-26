import { ImageData } from '../interfaces';
export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    role: string;
    image?: ImageData;
}
