import { Module, DynamicModule, Global } from '@nestjs/common';

import { IConfigService } from '../config/interfaces/config.interface';

@Global()
@Module({})
export class ConfigModule {

  public static register(configService: IConfigService): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: IConfigService,
          useValue: configService,
        },
      ],
      exports: [IConfigService],
    };
  }
}
