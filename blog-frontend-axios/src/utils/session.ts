import { StatusCodes } from 'http-status-codes';
import { IErrors } from '../types';

export function checkSessionExpired(errors: IErrors): boolean {
    const status = errors['status'] as any;
    const statusCode = parseInt(status);
    return statusCode === StatusCodes.UNAUTHORIZED;
   }