import { StatusCodes } from 'http-status-codes';
import { IErrors } from '../types';

export function checkSessionExpired(errors: IErrors): boolean {
    const status = errors['status'] as any;
    const statusCode = parseInt(status);
    return statusCode === StatusCodes.UNAUTHORIZED;
   }

export function checkNotFound(errors: IErrors): boolean {
const status = errors['status'] as any;
const statusCode = parseInt(status);
return statusCode === StatusCodes.NOT_FOUND;
}

export function checkUnauthorized(errors: IErrors): boolean {
    const status = errors['status'] as any;
    const statusCode = parseInt(status);
    return statusCode === StatusCodes.UNAUTHORIZED;
}

export function checkForbidden(errors: IErrors): boolean {
    const status = errors['status'] as any;
    const statusCode = parseInt(status);
    return statusCode === StatusCodes.FORBIDDEN;
}