import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from 'controllers/auth.controller';
import { AllRoles } from 'shared/enum/user-role.enum';

import { checkAuthGuard, checkJwtRefreshAuthGuard } from './check.guards';

describe('AuthController Guards', () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
        }).compile();
    });

    it('Method whoAmI:@Auth(AllRoles) should prevent access to not signed on users', () => {
      checkAuthGuard( AuthController.prototype.whoAmI, AllRoles);
    });

    it('Method whoAmI:@Auth(AllRoles) should fail because the supplied roles are differents from the expected ones', () => {
      try {
        checkAuthGuard( AuthController.prototype.whoAmI, []);
        throw new Error('Method whoAmI:@Auth(AllRoles) should have failed because the supplied roles are differents from the expected ones');
      } catch (error) {
        // OK fails as expected
      }
    });

    it('Method refresh: @UseGuards(JwtRefreshTokenAuthGuard) should prevent access to not signed on users', () => {
      checkJwtRefreshAuthGuard(AuthController.prototype.refresh);
    });
});
