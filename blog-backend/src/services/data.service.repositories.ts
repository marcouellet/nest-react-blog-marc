import { Injectable } from '@nestjs/common';

import { IDataRepositories } from 'repositories';

@Injectable()
export class DataServiceRepositories {

  constructor(
    private readonly dataServicesRepositories: IDataRepositories) {}

    repositories(): IDataRepositories  {
        return this.dataServicesRepositories;
    }
}
