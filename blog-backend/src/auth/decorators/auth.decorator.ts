import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '@Shared/enum';

import { JwtAuthGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';

export function Auth(roles: UserRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RoleGuard),
   );
}