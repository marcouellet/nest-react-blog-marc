import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '@Controllers/post.controller';
import { AllRoles } from '@blog-common/enum/user-role.enum';

import { checkAuthGuard } from './check.guards';

describe('PostController Guards', () => {

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
        }).compile();
    });

    it('Method createPost:@Auth(AllRoles) should prevent access to not signed on users', () => {
        checkAuthGuard(PostController.prototype.createPost, AllRoles);
    });

    it('Method updatePost:@Auth(AllRoles) should prevent access to not signed on users', () => {
        checkAuthGuard(PostController.prototype.updatePost, AllRoles);
    });

    it('Method deletePost:@Auth(AllRoles) should prevent access to not signed on users', () => {
        checkAuthGuard(PostController.prototype.deletePost, AllRoles);
    });
});
