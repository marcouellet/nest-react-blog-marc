// import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
// import { PostService } from './post-services.service';
// import { PostController } from '../../../controllers/port.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PostSchema } from '../../../frameworks/data-services/mongo/schemas/post.schema';
// import { AuthenticationMiddleware } from 'src/common/authentication.middleware';

// @Module({
//     imports: [
//         MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
//     ], // add this
//   providers: [PostService],
//   controllers: [PostController]
// })
// export class PostServiceModule implements NestModule {
//     configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
//       consumer.apply(AuthenticationMiddleware).forRoutes(
//         { method: RequestMethod.POST, path: '/post' },
//         { method: RequestMethod.PUT, path: '/post' },
//         { method: RequestMethod.DELETE, path: '/post' }
//       )
//     }
// }
import { Module } from '@nestjs/common';
import { DataServicesModule } from '../../data-services/data-services.module';
import { PostFactoryService } from './post-factory.service';
import { PostServices } from './post-services.service';

@Module({
  imports: [DataServicesModule],
  providers: [PostFactoryService, PostServices],
  exports: [PostFactoryService, PostServices],
})
export class PostServicesModule {}
