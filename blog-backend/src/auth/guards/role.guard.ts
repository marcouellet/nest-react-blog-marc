import { Injectable,CanActivate,ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../../core/enum/user-role.enum";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean {
        const requiredRole= this.reflector.getAllAndOverride<UserRole>('role',[
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRole) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return user && user.role === requiredRole;
    }
}