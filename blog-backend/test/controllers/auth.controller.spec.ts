import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { JwtPayload } from '../../src/auth/interfaces/jwt.interface';
import { whoAmITestResponse } from '../data/user.data';



describe('AuthController', () => {
    let authService: AuthService;
    let authController: AuthController;

    beforeEach(async () => {
        const auth: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          {
            provide: AuthService,
            useValue: {
              validateToken: jest.fn().mockImplementation((token: string) => Promise.resolve(whoAmITestResponse)),
            },
          },
        ],
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


    // describe('whoAmI', () => {
    //     it('should return "dummy@gmail.com"', () => {
    //       expect(authController.whoAmI('token').resolves.toEqual(whoAmITestResponse));
    //     });
    // });
});
