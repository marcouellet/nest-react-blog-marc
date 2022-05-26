import { Module } from '@nestjs/common';
import { GetConfig } from '../config/config';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth.module';
import { DataModule } from './data.module';
import { UserModule } from './user.module';
import { PostModule } from './post.module';
@Module({
  imports: [
    ConfigModule,
    AuthModule,
    DataModule.register(GetConfig()),
    UserModule,
    PostModule,
 ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
