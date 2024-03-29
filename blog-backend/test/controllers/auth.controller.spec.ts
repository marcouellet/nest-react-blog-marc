import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from 'controllers/auth.controller';
import { AuthService } from 'services/auth.service';
import AuthServiceMock from '../mocks/auth.service.mock';
import { testNotLoggedInDto, testRegisterUnknownUserDto, testJwtPayload, testRequestWithAuthorize } from '../data/auth.data';
import { testUserDto, testUserUnknownDto} from '../data/user.data';

describe('AuthController', () => {

    let authController: AuthController;
    let authServiceMock: AuthService;

    beforeAll(async () => {
        const auth: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [AuthServiceMock],
        }).compile();

        authController = auth.get<AuthController>(AuthController);
        authServiceMock = auth.get<AuthService>(AuthService);
    });

    it('authController should be defined', () => {
        expect(authController).toBeDefined();
    });

    it('authService should be defined', () => {
        expect(authServiceMock).toBeDefined();
    });

    describe('whoAmI', () => {
        it('should return "dummy@email.com"', async () => {
          expect(await authController.whoAmI(testRequestWithAuthorize)).toStrictEqual(testJwtPayload);
          expect(authServiceMock.validateToken).toHaveBeenCalled();
        });
    });

    describe('login', () => {
      it('should return a user"', async () => {
        expect(await authController.login(testNotLoggedInDto)).toStrictEqual(testUserDto);
        expect(authServiceMock.login).toHaveBeenCalled();
      });
    });

    describe('register', () => {
      it('should return a user', async () => {
        expect(await authController.register(testRegisterUnknownUserDto)).toStrictEqual(testUserUnknownDto);
        expect(authServiceMock.register).toHaveBeenCalled();
      });
    });
});
