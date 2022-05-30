import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import AuthServiceProvider from '../providers/auth.service.provider';
import { testLoginDto, testRegisterDto, testJwtPayload, testRequestWithAuthorize } from '../data/auth.data';
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
        expect(await authController.login(testRequestWithAuthorize, testLoginDto)).toStrictEqual(testUserDto);
      });
    });

    describe('login - when already logged in', () => {
      it('should throw exception', async () => {
        expect(await authController.login(testRequestWithAuthorizeAndUser, testLoginDto)).toThrow(ForbiddenException);
      });
    });

    describe('register', () => {
      it('should return a user', async () => {
        expect(await authController.register(testRegisterDto)).toStrictEqual(testUserDto);
      });
    });
});
