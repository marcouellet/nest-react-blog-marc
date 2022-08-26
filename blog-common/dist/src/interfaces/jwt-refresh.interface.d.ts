import { IAuthToken } from './jwt.interface';
export interface IRefresh {
    authtoken?: IAuthToken;
    authrefreshtoken?: IAuthToken;
}
