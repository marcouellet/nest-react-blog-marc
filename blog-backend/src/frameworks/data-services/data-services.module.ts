import { Module, DynamicModule, Global } from '@nestjs/common';
import { IConfigModuleOptions, DataServerName } from '../../configuration'
import { MongoDataServicesModule } from '../../frameworks/data-services/mongo/mongo-data-services.module';
import { NotFoundException } from '@nestjs/common';

@Global()
@Module({})
export class DataServicesModule {
   
  static configure(options: IConfigModuleOptions): DynamicModule {

    switch (options.dataServerName) {
      case DataServerName.MONGO:
        return {
          module: DataServicesModule,
          imports: [MongoDataServicesModule],
          exports: [MongoDataServicesModule]
        }
    
      default:
          throw new NotFoundException("No implementations for data services of type " + 
          options.dataServerName);
    }
  }
}
