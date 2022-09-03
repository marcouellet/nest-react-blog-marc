import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from 'shared/enum';

import { JwtAuthGuard } from 'auth/guards/jwt.guard';
import { RoleGuard } from 'auth/guards/role.guard';

export function Auth(roles: UserRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RoleGuard),
   );
}