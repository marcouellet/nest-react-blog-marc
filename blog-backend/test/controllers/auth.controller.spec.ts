import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import AuthServiceProvider from '../providers/auth.service.provider';
import { testLoginDto, testRegisterDto, testJwtPayload, testRequestWithAuthorize } from '../data/auth.data';
import { testUserDto, testRequestWithAuthorizeAndUser} from '../data/user.data';

describe('AuthController', () => {
    let authService: AuthService;
    let authController: AuthController;

    beforeEach(async () => {
        const auth: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [AuthServiceProvider],
        }).compile();

        authController = auth.get<AuthController>(AuthController);
        authService = auth.get<AuthService>(AuthService);
    });

    it('authController should be defined', () => {
        expect(authController).toBeDefined();
    });

    it('authService should be defined', () => {
    expect(authService).toBeDefined();
    });

    describe('whoAmI', () => {
        it('should return "dummy@gmail.com"', () => {
          expect(authController.whoAmI(testRequestWithAuthorize)).toBe(testJwtPayload);
        });
    });

    describe('login', () => {
      it('should return a user"', () => {
        expect(authController.login(testRequestWithAuthorize, testLoginDto)).toBe(testUserDto);
      });
    });

    describe('login - when already logged in', () => {
      it('should throw exception', () => {
        expect(authController.login(testRequestWithAuthorizeAndUser, testLoginDto)).toBeInstanceOf(ForbiddenException);
      });
    });

    describe('register', () => {
      it('should return a user', () => {
        expect(authController.register(testRegisterDto)).toBe(testUserDto);
      });
    });
});
