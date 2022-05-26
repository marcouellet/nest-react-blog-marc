import { Module, DynamicModule } from '@nestjs/common';
import { IConfig, MONGO_SERVER_NAME } from '../config/config';
import { MongoDataModule } from '../frameworks/data/mongo/mongo-data.module';
import { NotFoundException } from '@nestjs/common';
@Module({})
export class DataModule {

  public static register(config: IConfig): DynamicModule {

    const modules: any[] = [];
    let serverFound: boolean = true;

    const dataServerName = config.dataServerName;

    switch (dataServerName) {
      case MONGO_SERVER_NAME:
        modules.push(MongoDataModule);
        break;
      default:
        serverFound = false;
    }

    if (serverFound) {
      return {
        module: DataModule,
        imports: modules,
      };
    } else {
      throw new NotFoundException(`No implementations for data services of type ${dataServerName}`);
    }
  }
}
