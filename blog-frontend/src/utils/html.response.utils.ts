import { StatusCodes } from 'http-status-codes';
import { IErrors } from 'types';
import { isTokenValid } from 'utils';

export function getTokenFromErrors(errors: IErrors) {
    return errors['token'] as any;
}

export function checkSessionExpired(errors: IErrors): boolean {
    const status = errors['status'] as any;
    const statusCode = parseInt(status);
    if(statusCode === StatusCodes.UNAUTHORIZED) {
        const token = errors['token'] as any;
        if (token) {
            return !isTokenValid(token);
        } else {
            return false;
        }
    } else {
        return false;
    }
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

export function checkTimeout(errors: IErrors): boolean {
    const status = errors['status'] as any;
    const statusCode = parseInt(status);
    return statusCode === StatusCodes.REQUEST_TIMEOUT;
}