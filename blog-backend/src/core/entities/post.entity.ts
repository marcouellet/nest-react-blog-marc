import { User, Category } from './';

export interface IPostImage {
  data: Buffer;
  contentType: String;
}
export class Post {
  id?: string;
  title: string;
  description: string;
  body: string;
  category: Category;
  image: IPostImage;
  user: User;
  publishDate: Date;
}

export const minimumPostTitleLength = 3;
export const minimumPostDescriptionLength = 10;
export const minimumPostBodyLength = 10;
