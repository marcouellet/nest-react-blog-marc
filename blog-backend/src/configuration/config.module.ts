import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigService } from './'

export enum DataServerName {
  MONGO,
  MYSQL,
}
export abstract class IConfigModuleOptions {
  dataServerName: DataServerName;
  connectionString: string;
}

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
        ConfigService
      ],
      exports: [IConfigModuleOptions, ConfigService],
    };
  }
}