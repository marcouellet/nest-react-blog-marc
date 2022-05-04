import { Module, DynamicModule, Global } from '@nestjs/common';
import { IDataServicesRepositories } from '../../core';
import { IConfig, MONGO_SERVER_NAME } from '../../config/config';
import { MongoDataServicesModule } from './mongo/mongo-data-services.module';
import { NotFoundException } from '@nestjs/common';
@Global()
@Module({})
export class DataServicesModule {

  public static register(config : IConfig): DynamicModule {

    let modules: any[] = [];
    let providers: any[] = [];
    let serverFound: boolean = true;

    const dataServerName = config.dataServerName;

    switch (dataServerName) {
      case MONGO_SERVER_NAME:
        modules.push(MongoDataServicesModule);
        providers.push(IDataServicesRepositories);
        break;
      default: 
        serverFound = false;
    }

    if (serverFound) {
      return {
        module: DataServicesModule,
        imports: modules,
        providers: providers,
        exports: [IDataServicesRepositories],
      };
    } else {
      throw new NotFoundException("No implementations for data services of type " + 
      dataServerName);          
    }
  }
}
