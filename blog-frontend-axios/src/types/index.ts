export interface IUser {
  id?: number; // Identifier uniq
  username: string;
  password?: string;
  email: string;
}

export type User = IUser & { token?: string };
export interface IPost {
  id?: number; // Identifier uniq
  title: string;
  description: string;
  body: string;
  user: IUser;
  publishDate: Date;
}

export interface IErrors {
  [key: string]: string[];
}
