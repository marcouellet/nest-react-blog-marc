import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../core/enum/user-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const isAllowed =  user && requiredRoles.some((role) => user.role == role);
        if (!isAllowed) {
            throw new UnauthorizedException(); // default is ForbiddenException
        }
        return isAllowed;
    }
}
