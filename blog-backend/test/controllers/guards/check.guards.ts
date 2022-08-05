import { JwtAuthGuard } from '../../../src/auth/guards/jwt.guard';
import { JwtRefreshTokenAuthGuard } from '../../../src/auth/guards/jwt-refresh.guard';
import { RoleGuard } from '../../../src/auth/guards/role.guard';
import { UserRole } from '../../../src/core';

function compareRoles(rolesSupplied: UserRole[], rolesExpected: UserRole[]): boolean {
    const suppliedSet = new Set(rolesSupplied);
    const expectedSet = new Set(rolesExpected);

    if (suppliedSet.size !== expectedSet.size) {
        return false;
    }

    return Array.from(suppliedSet).every(element => {
        return expectedSet.has(element);
      });
}

export function checkJwtRefreshAuthGuard(method: any) {
    const guards = Reflect.getMetadata('__guards__', method);
    expect(guards.length).toEqual(1);
    expect(new guards[0]).toBeInstanceOf(JwtRefreshTokenAuthGuard);
}

export function checkAuthGuard(method: any, expectedRoles: UserRole[]) {
    const guards = Reflect.getMetadata('__guards__', method);
    expect(guards.length).toEqual(2);
    expect(new guards[0]).toBeInstanceOf(JwtAuthGuard);
    expect(new guards[1]).toBeInstanceOf(RoleGuard);
    const roles: UserRole[] = Reflect.getMetadata('roles', method);
    expect(compareRoles(roles, expectedRoles)).toBeTruthy();
}
