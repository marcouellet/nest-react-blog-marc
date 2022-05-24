import { Injectable,CanActivate,ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../../core/enum/user-role.enum";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean {
        const requireRoles= this.reflector.getAllAndOverride<UserRole[]>('roles',[
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requireRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return user && requireRoles.some((role) => user.role === role);
    }
}