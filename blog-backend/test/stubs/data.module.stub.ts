import { Module, DynamicModule } from '@nestjs/common';

import { IConfigService } from 'config/interfaces/config.interface';
import { MONGO_SERVER_NAME } from 'config/config.constants';
import { MongoDataModuleStub } from './mongo-data.module.stub';
@Module({})
export class DataModuleStub {

  public static register(configService: IConfigService): DynamicModule {

    const modules: any[] = [];

    // getConfig() throw an exception if dataServerName has an invalid server name
    const dataServerName = configService.getConfig().dataServerName;

    switch (dataServerName) {
      case MONGO_SERVER_NAME:
        modules.push(MongoDataModuleStub);
        break;
     }

    return {
        module: DataModuleStub,
        imports: modules,
      };
  }
}
