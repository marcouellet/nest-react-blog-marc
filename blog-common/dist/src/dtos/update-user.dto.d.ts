import { ImageData } from '../interfaces';
export declare class UpdateUserDto {
    username: string;
    email: string;
    password?: string;
    role?: string;
    image?: ImageData;
}
export interface IUpdateUserCriterias {
    username: string;
    email: string;
    password: string;
    role: string;
    image: ImageData;
}
