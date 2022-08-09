import { Module, DynamicModule } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { IConfigService } from '../config/interfaces/config.interface';
import { MONGO_SERVER_NAME } from '../config/config.constants';
import { MongoDataModule } from '../frameworks/data/mongo/mongo-data.module';
@Module({})
export class DataModule {

  public static register(configService: IConfigService): DynamicModule {

    const modules: any[] = [];

    // getConfig() throw an exception if dataServerName has an invalid server name
    const dataServerName = configService.getConfig().dataServerName;
    const dataServerConnectionString = configService.getConfig().connectionString;

    configService.getConfig()
    Logger.log(`Accessing data base ${dataServerName} with connection string: ` + dataServerConnectionString);

    switch (dataServerName) {
      case MONGO_SERVER_NAME:
        modules.push(MongoDataModule);
        break;
    }

    return {
      module: DataModule,
      imports: modules,
    };
  }
}
