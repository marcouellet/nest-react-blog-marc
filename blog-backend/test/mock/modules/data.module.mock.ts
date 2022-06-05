import { Module, DynamicModule } from '@nestjs/common';
import { IConfigService } from '../../../src/config/interfaces/config.interface';
import { MONGO_SERVER_NAME } from '../../../src/config/config.constants';
import { MongoDataModuleMock } from '../data/mongo/mongo-data.module.mock';
@Module({})
export class DataModuleMock {

  public static register(configService: IConfigService): DynamicModule {

    const modules: any[] = [];

    // getConfig() throw an exception if dataServerName has an invalid server name
    const dataServerName = configService.getConfig().dataServerName;

    switch (dataServerName) {
      case MONGO_SERVER_NAME:
        modules.push(MongoDataModuleMock);
        break;
     }

    return {
        module: DataModuleMock,
        imports: modules,
      };
  }
}
