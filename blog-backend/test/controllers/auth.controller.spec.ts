import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import AuthServiceProvider from '../providers/auth.service.provider';
import { testNotLoggedInDto, testAlreadyLoggedInDto, testNotRegisteredDto, testAlreadyRegisteredDto,
        testJwtPayload, testRequestWithAuthorize } from '../data/auth.data';
import { testUserDto, testRequestWithAuthorizeAndUser} from '../data/user.data';

describe('AuthController', () => {

    let authController: AuthController;

    beforeEach(async () => {
        const auth: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [AuthServiceProvider],
        }).compile();

        authController = auth.get<AuthController>(AuthController);
    });

    it('authController should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('whoAmI', () => {
        it('should return "dummy@gmail.com"', async () => {
          expect(await authController.whoAmI(testRequestWithAuthorize)).toStrictEqual(testJwtPayload);
        });
    });

    describe('login', () => {
      it('should return a user"', async () => {
        expect(await authController.login(testRequestWithAuthorize, testNotLoggedInDto)).toStrictEqual(testUserDto);
      });
    });

    describe('register', () => {
      it('should return a user', async () => {
        expect(await authController.register(testNotRegisteredDto)).toStrictEqual(testUserDto);
      });
    });
});
