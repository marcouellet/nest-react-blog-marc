export interface IUser {
  id?: string; // Identifier uniq
  username: string;
  password?: string;
  email: string;
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
  publishDate?: Date;
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

export interface IUpdatePost {
  title: string;
  description: string;
  body: string;
}

export function createPostForUpdate(post: IPost): IUpdatePost {
  const updatePost: IUpdatePost = {title:post.title, description: post.description, body: post.body};
  return updatePost;
}
