export interface IUser {
  id?: string; // Identifier uniq
  username: string;
  password?: string;
  email: string;
}

export type User = IUser & { token?: string };

export interface IPost {
  id?: string; // Identifier uniq
  title: string;
  description: string;
  body: string;
  user?: IUser;
  publishDate?: Date;
}
export interface IUpdatePost {
  title: string;
  description: string;
  body: string;
}
export interface IErrors {
  [key: string]: string[];
}

export function createPostForUpdate(post: IPost): IUpdatePost {
  const updatePost: IUpdatePost = {title:post.title, description: post.description, body: post.body};
  return updatePost;
}
