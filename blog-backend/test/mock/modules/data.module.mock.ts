import { Module, DynamicModule } from '@nestjs/common';
import { IConfig, MONGO_SERVER_NAME } from '../config/config.mock';
import { MongoDataModuleMock } from '../data/mongo/mongo-data.module.mock';
import { NotFoundException } from '@nestjs/common';
@Module({})
export class DataModuleMock {

  public static register(config: IConfig): DynamicModule {

    const modules: any[] = [];
    let serverFound: boolean = true;

    const dataServerName = config.dataServerName;

    switch (dataServerName) {
      case MONGO_SERVER_NAME:
        modules.push(MongoDataModuleMock);
        break;
      default:
        serverFound = false;
    }

    if (serverFound) {
      return {
        module: DataModuleMock,
        imports: modules,
      };
    } else {
      throw new NotFoundException(`No implementations for data services of type ${dataServerName}`);
    }
  }
}
