export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export interface IUser {
    id?: string;
    username: string;
    password?: string;
    email: string;
    role: string;
    image?: ImageData;
}
export declare class IAuthToken {
    accessToken: any;
}
export declare type JWTPayload = {
    sub: string;
    exp: number;
    expiresIn: number;
};
export declare type User = IUser & {
    authtoken?: IAuthToken;
    authrefreshtoken?: IAuthToken;
};
export interface IPost {
    id?: string;
    title: string;
    description: string;
    body: string;
    user?: User;
    category?: ICategory;
    image?: ImageData;
    publishDate?: Date;
}
export interface ICategory {
    id?: string;
    title: string;
    description: string;
}
export interface ImageData {
    base64: string;
    contentType: string;
}
export interface ILogin {
    email: string;
    password: string;
}
export interface IRegister {
    username: string;
    email: string;
    password: string;
}
export interface IRefresh {
    authtoken?: IAuthToken;
    authrefreshtoken?: IAuthToken;
}
export interface ISessionExtension {
    authtoken?: IAuthToken;
    authrefreshtoken?: IAuthToken;
    extension: number;
}
export interface IErrors {
    [key: string]: string | string[];
}
export interface IUpdateUser {
    username: string;
    email: string;
    password?: string;
    role: string;
    image?: ImageData;
}
export declare function createUserForUpdate(user: IUser): IUpdateUser;
export interface IUpdatePost {
    title: string;
    description: string;
    body: string;
    category?: ICategory;
    image?: ImageData;
}
export interface IFilterFindContainsCriterias {
    property: string;
    value: string;
}
export interface IFilterFindExistCriterias {
    property: string;
    exist: boolean;
}
export interface IUpdateCategory {
    title: string;
    description: string;
}
export interface IFilterFindCriterias {
    contains?: IFilterFindContainsCriterias;
    exist?: IFilterFindExistCriterias;
}
export interface ImageSizeProps {
    maxWidth: number;
    maxHeight: number;
}
export declare type PostEditingFormState = {
    categoryTitle: string;
    title: string;
    description: string;
    body: string;
    imageChanged: boolean;
};
export interface IPostEditingState {
    content?: string;
    formState: PostEditingFormState;
    category?: ICategory;
    postImage?: ImageData;
    postUrl: string;
    isDirty: boolean;
}
export declare function createPostForUpdate(post: IPost): IUpdatePost;
export declare function createCategoryForUpdate(category: ICategory): IUpdateCategory;
export declare const minimumPasswordLength = 3;
export declare const minimumEmailLength = 10;
export declare const minimumUserNameLength = 2;
export declare const minimumPostTitleLength = 3;
export declare const minimumPostDescriptionLength = 10;
export declare const minimumPostBodyLength = 10;
export declare const minimumCategoryTitleLength = 3;
export declare const minimumCategoryDescriptionLength = 10;
