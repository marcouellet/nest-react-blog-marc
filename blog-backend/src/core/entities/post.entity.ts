import { User } from './';

export class Post {
  id?: string;
  title: string;
  description: string;
  body: string;
  user: User;
  publishDate: Date;
}
