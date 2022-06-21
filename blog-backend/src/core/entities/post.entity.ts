import { User, Category } from './';

export class Post {
  id?: string;
  title: string;
  description: string;
  body: string;
  category: Category;
  user: User;
  publishDate: Date;
}

export const minimumPostTitleLength = 3;
export const minimumPostDescriptionLength = 10;
export const minimumPostBodyLength = 10;
