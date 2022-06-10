import { User } from './';

export class Post {
  id?: string;
  title: string;
  description: string;
  body: string;
  user: User;
  publishDate: Date;
}

export const minimumTitleLength = 3;
export const minimumDescriptionLength = 10;
export const minimumBodyLength = 10;
