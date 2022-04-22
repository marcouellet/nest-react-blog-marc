import { ModuleRef } from '@nestjs/core';
import { OnModuleInit, Injectable, NotFoundException, Global } from '@nestjs/common';
import { IDataServicesRepositories } from '../core';
import { IConfigModuleOptions} from './config.module.options'
import { MongoDataServicesRepositories } from '../frameworks/data-services/mongo/mongo-data-services-repositories';

export enum DataServerName {
    MONGO,
    MYSQL,
}

@Global()
@Injectable()
export class ConfigDataService implements OnModuleInit {

    dataServicesRepositories : IDataServicesRepositories;

    constructor(private options: IConfigModuleOptions, private moduleRef: ModuleRef) {}

     async onModuleInit() {
        this.dataServicesRepositories = await this.moduleRef.resolve(this.getRepositoriesProvider());
      }

    private getRepositoriesProvider() : any {
        switch (this.options.dataServerName) {
            case DataServerName.MONGO:
                return MongoDataServicesRepositories;
            default:
                throw new NotFoundException("No implementations for data services of type " + 
                                            this.options.dataServerName);
        }
    }

    public getRepositories() : IDataServicesRepositories {
        return this.dataServicesRepositories;
    }
}



 