import { Type, ClassProvider, NotFoundException } from '@nestjs/common';
import { IDataRepositories } from '../../src/core/abstracts/data-repositories.abstract';
import { IConfig, MONGO_SERVER_NAME } from '../mock/config/config.mock';
import { MongoDataRepositoriesMock } from '../mock/data/mongo/mongo-data-repositories.mock'

class DatatServiceProvider {

    public static register(config: IConfig): ClassProvider {

        let providerClass: Type;
        let providerFound = true;

        const dataServerName = config.dataServerName;

        switch (dataServerName) {
          case MONGO_SERVER_NAME:
            providerClass = MongoDataRepositoriesMock;
            break;
          default:
            providerFound = false;
        }

        if (providerFound) {
            return {
                provide: IDataRepositories,
                useClass: providerClass,
            };
         } else {
            throw new NotFoundException(`No implementations for data provider of type ${dataServerName}`);
          }
    }
}

export default DatatServiceProvider;
