import { IUser } from './';

export interface IPost {
  id: number; // Identifier uniq
  title: String;
  description: String;
  body: String;
  user: IUser;
  publishDate: Date;
}