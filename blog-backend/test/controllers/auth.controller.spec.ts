import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import AuthServiceMock from '../mock/auth.service.mock';
import { testNotLoggedInDto, testRegisterUnknownUserDto, testJwtPayload, testRequestWithAuthorize } from '../data/auth.data';
import { testUserDto, testUserUnknownDto} from '../data/user.data';

describe('AuthController', () => {

    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const auth: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [AuthServiceMock],
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
        it('should return "dummy@gmail.com"', async () => {
          expect(await authController.whoAmI(testRequestWithAuthorize)).toStrictEqual(testJwtPayload);
          expect(authService.validateToken).toHaveBeenCalled();
        });
    });

    describe('login', () => {
      it('should return a user"', async () => {
        expect(await authController.login(testRequestWithAuthorize, testNotLoggedInDto)).toStrictEqual(testUserDto);
        expect(authService.login).toHaveBeenCalled();
      });
    });

    describe('register', () => {
      it('should return a user', async () => {
        expect(await authController.register(testRegisterUnknownUserDto)).toStrictEqual(testUserUnknownDto);
        expect(authService.register).toHaveBeenCalled();
      });
    });
});
