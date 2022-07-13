import { ImageData } from '../interfaces';
export class User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
  image?: ImageData;
}

export const minimumUserNameLength = 2;
export const minimumUserEmailLength = 10;
export const minimumUserPasswordLength = 3;


