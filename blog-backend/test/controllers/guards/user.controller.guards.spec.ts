import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@Controllers/user.controller';
import { UserRole } from '@Shared/enum/user-role.enum';

import { checkAuthGuard } from './check.guards';

describe('UserController Guards', () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
        }).compile();
    });

    it('Method getAll:@Auth([UserRole.ADMIN]) should prevent access to not signed on users', () => {
        checkAuthGuard(UserController.prototype.getAll, [UserRole.ADMIN]);
    });

    it('Method getById:@Auth([UserRole.ADMIN]) should prevent access to not signed on users', () => {
        checkAuthGuard(UserController.prototype.getById, [UserRole.ADMIN]);
    });

    it('Method createUser:@Auth([UserRole.ADMIN]) should prevent access to not signed on users', () => {
        checkAuthGuard(UserController.prototype.createUser, [UserRole.ADMIN]);
    });

    it('Method updateUser:@Auth([UserRole.ADMIN]) should prevent access to not signed on users', () => {
        checkAuthGuard(UserController.prototype.updateUser, [UserRole.ADMIN]);
    });

    it('Method deleteUser:@Auth([UserRole.ADMIN]) should prevent access to not signed on users', () => {
        checkAuthGuard(UserController.prototype.deleteUser, [UserRole.ADMIN]);
    });
});
