import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorServicesModule } from './services/use-cases/author/author-services.module';
import { PostServicesModule } from './services/use-cases/post/post-services.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-blog-project', { useNewUrlParser: true, useUnifiedTopology: true }),
    AuthorServicesModule,
    PostServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
