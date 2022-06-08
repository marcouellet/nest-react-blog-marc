import { Injectable } from '@nestjs/common';
import { IDataRepositories, IGenericDataRepository } from '../core/repositories';
import { User, Post } from '../core/entities';

@Injectable()
export class DataServiceRepositories {

  constructor(
    private readonly dataServicesRepositories: IDataRepositories) {}

    repositories(): IDataRepositories  {
        return this.dataServicesRepositories;
    }
}
