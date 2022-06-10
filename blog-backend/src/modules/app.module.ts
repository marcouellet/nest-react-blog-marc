import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth.module';
import { DataModule } from './data.module';
import { UserModule } from './user.module';
import { PostModule } from './post.module';
import { GLOBAL_CONFIG_SERVICE } from '../config/config.global';

@Module({
    imports: [
      ConfigModule.register(GLOBAL_CONFIG_SERVICE),
      DataModule.register(GLOBAL_CONFIG_SERVICE),
      AuthModule,
      UserModule,
      PostModule,
  ],
    controllers: [AppController],
    providers: [AppService],
 })
export class AppModule {}
