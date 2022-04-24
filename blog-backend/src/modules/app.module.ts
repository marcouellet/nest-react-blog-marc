import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, GetConfigOptions } from '../config';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthorModule } from './author.module';
import { PostModule } from './post.module';
import { DataServicesModule } from '../frameworks/data-services/data-services.module';

@Module({
  imports: [
    ConfigModule,
    DataServicesModule.register(GetConfigOptions()),
    AuthorModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService],
})
export class AppModule {}
