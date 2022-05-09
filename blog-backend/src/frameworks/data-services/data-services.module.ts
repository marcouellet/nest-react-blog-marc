import { Module, DynamicModule, Global } from '@nestjs/common';
import { IConfig, MONGO_SERVER_NAME } from '../../config/config';
import { MongoDataServicesModule } from './mongo/mongo-data-services.module';
import { NotFoundException } from '@nestjs/common';
@Module({})
export class DataServicesModule {

  public static register(config: IConfig): DynamicModule {

    const modules: any[] = [];
    let serverFound: boolean = true;

    const dataServerName = config.dataServerName;

    switch (dataServerName) {
      case MONGO_SERVER_NAME:
        modules.push(MongoDataServicesModule);
        break;
      default:
        serverFound = false;
    }

    if (serverFound) {
      return {
        module: DataServicesModule,
        imports: modules,
      };
    } else {
      throw new NotFoundException(`No implementations for data services of type ${dataServerName}`);
    }
  }
}
