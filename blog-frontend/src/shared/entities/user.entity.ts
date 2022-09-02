import { ImageData, IAuthToken } from '../interfaces';
import { UserRole } from '../enum';

export class User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  image?: ImageData;
}

export class AuthenticatedUser extends User {
  authtoken?: IAuthToken;
   authrefreshtoken?: IAuthToken;
}

export const minimumUserNameLength = 2;
export const minimumUserEmailLength = 10;
export const minimumUserPasswordLength = 3;


