import { DynamicModule } from '@nestjs/common';
import { AppController } from '@Controllers/app.controller';
import { AppService } from '@Services/app.service';

import { ConfigModule } from './config.module';
import { AuthModule } from './auth.module';
import { DataModule } from './data.module';
import { UserModule } from './user.module';
import { PostModule } from './post.module';
import { CategoryModule } from './category.module';
import { IConfigService } from '../config/interfaces/config.interface';
export class AppModule {

  public static register(configService: IConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.register(configService),
        DataModule.register(configService),
        AuthModule,
        UserModule,
        PostModule,
        CategoryModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
