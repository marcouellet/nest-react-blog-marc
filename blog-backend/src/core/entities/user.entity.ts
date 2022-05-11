import { UserRole } from '../enum'
export class User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role?: UserRole;
  }
