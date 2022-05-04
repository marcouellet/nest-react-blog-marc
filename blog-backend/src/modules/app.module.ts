import { Module } from '@nestjs/common';
import { GetConfig } from '../config';
import { AppController } from '../controllers';
import { ConfigService, AppService, AuthService } from '../services';
import { ConfigModule, UserModule, PostModule, AuthModule } from './';
import { DataServicesModule } from '../frameworks/data-services/data-services.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    DataServicesModule.register(GetConfig()),
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, AuthService],
})
export class AppModule {}
