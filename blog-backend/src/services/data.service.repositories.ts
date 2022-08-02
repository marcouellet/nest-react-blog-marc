import { Injectable } from '@nestjs/common';

import { IDataRepositories } from '../core/repositories';

@Injectable()
export class DataServiceRepositories {

  constructor(
    private readonly dataServicesRepositories: IDataRepositories) {}

    repositories(): IDataRepositories  {
        return this.dataServicesRepositories;
    }
}
