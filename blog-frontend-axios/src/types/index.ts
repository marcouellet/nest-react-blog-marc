export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IUser {
  id?: string; // Identifier uniq
  username: string;
  password?: string;
  email: string;
  role: string;
  createdOn?: Date;
}

export class IAuthToken {
  accessToken: any;
}

export type JWTPayload = {
  sub: string;
  exp: number;
};

export type User = IUser & { authtoken?: IAuthToken, authrefreshtoken?: IAuthToken };

export interface IPost {
  id?: string; // Identifier uniq
  title: string;
  description: string;
  body: string;
  user?: IUser;
  category?: ICategory;
  publishDate?: Date;
}
export interface ICategory {
  id?: string; // Identifier uniq
  title: string;
  description: string;
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

export interface IErrors {
  [key: string]: string[];
}

export interface IUpdateUser {
  username: string;
  email: string;
  password?: string;
  role: string;
}

export function createUserForUpdate(user: IUser): IUpdateUser {
  const updateUser: IUpdateUser = {username:user.username, email: user.email, password: user.password, role: user.role};
  if (!updateUser.password) {
    delete updateUser.password;
  }
  return updateUser;
}
export interface IUpdatePost {
  title: string;
  description: string;
  body: string;
  category?: ICategory;
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

export function createPostForUpdate(post: IPost): IUpdatePost {
  const updatePost: IUpdatePost = {category: post.category, title:post.title, description: post.description, body: post.body};
  return updatePost;
}

export function createCategoryForUpdate(category: ICategory): IUpdateCategory {
  const updateCategory: IUpdateCategory = {title:category.title, description: category.description};
  return updateCategory;
}

export const minimumPasswordLength = 3;
export const minimumEmailLength = 10;
export const minimumUserNameLength = 2;

export const minimumPostTitleLength = 3;
export const minimumPostDescriptionLength = 10;
export const minimumPostBodyLength = 10;

export const minimumCategoryTitleLength = 3;
export const minimumCategoryDescriptionLength = 10;

