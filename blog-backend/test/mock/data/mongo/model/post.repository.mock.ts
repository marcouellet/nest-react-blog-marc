import { Injectable } from '@nestjs/common';
import { IGenericDataRepository } from '../../../../../src/core/abstracts/generic-data-repository.abstract';
import { Post } from '../../../../../src/core/entities';
import { testPost } from '../../../../data/post.data';

@Injectable()
export class PostRepositoriesMock implements IGenericDataRepository<Post> {

    convertToGenericEntity(obj: any): Post {
        const newObj = obj;
        newObj.id = obj._id.toString();
        delete newObj._id;
        return newObj;
      }

      convertFromGenericEntity(obj: any): Post {
        const newObj = obj;
        obj._id = obj.id;
        delete newObj.id;
        return newObj;
      }

    async getAll(): Promise<Post[]> {
        return Promise.resolve([testPost]);
    }

    async get(id: string): Promise<Post> {
        return Promise.resolve(testPost);
    }

    async findOne(criterias: {}): Promise<Post> {
        return Promise.resolve(testPost);
    }

    async findMany(criterias: {}): Promise<Post[]> {
        return Promise.resolve([testPost]);
    }

    async findManyCount(criterias: {}): Promise<number> {
        return Promise.resolve(1);
    }

    async findManyCountForSubDocumentId(subDocumentName: string, subDocumentId: string): Promise<number> {
        return Promise.resolve(1);
    }

    async create(item: Post): Promise<Post> {
        const user: any = undefined;
        return user as Promise<Post>;
    }

    async update(id: string, update: {}, populate?: string) {
        return Promise.resolve(testPost);
    }

    async delete(id: string, populate?: string): Promise<Post> {
        return Promise.resolve(testPost);
    }
}
