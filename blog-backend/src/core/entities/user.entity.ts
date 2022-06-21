export class User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
  createdOn: Date;
  }

export const minimumUserNameLength = 2;
export const minimumUserEmailLength = 10;
export const minimumUserPasswordLength = 3;


