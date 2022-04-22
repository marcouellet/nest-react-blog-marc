import { Module, DynamicModule } from '@nestjs/common';
import { MongoDataServicesModule } from './mongo/mongo-data-services.module';

@Module({})
export class DataServicesModule {

  static forDataServicesModule(dataServicesModule: DynamicModule): DynamicModule {

    return {
      module: DataServicesModule,
      imports: [dataServicesModule],
      exports: [dataServicesModule],
      providers: dataServicesModule.providers
    };
  }
}
