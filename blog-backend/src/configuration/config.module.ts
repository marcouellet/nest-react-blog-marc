import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigService, ConfigDataService} from './'
import { IConfigModuleOptions} from './config.module.options'

@Global()
@Module({})
export class ConfigModule {
  static register(options: IConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: IConfigModuleOptions,
          useValue: options,
        },
        ConfigService,
        ConfigDataService
      ],
      exports: [ConfigService, ConfigDataService],
    };
  }
}