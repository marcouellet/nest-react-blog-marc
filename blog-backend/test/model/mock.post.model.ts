import { User } from './mock.user.model';

export class Post {
  title: string;
  description: string;
  body: string;
  user: User;
  publishDate: Date;
}
