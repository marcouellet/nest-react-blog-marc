import { Injectable } from '@nestjs/common';
import { IGenericDataRepository } from '../../../../../src/core/abstracts/generic-data-repository.abstract';
import { Post } from '../../../../../src/core/entities';
import { testPost, testPostCount } from '../../../../data/post.data';

@Injectable()
export class PostRepositoriesMock implements IGenericDataRepository<Post> {

    convertToGenericEntity(obj: any): Post {
        return obj;
      }

      convertFromGenericEntity(obj: any): Post {
        return obj;
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
        return Promise.resolve(testPostCount);
    }

    async findManyCountForSubDocumentId(subDocumentName: string, subDocumentId: string): Promise<number> {
        return Promise.resolve(testPostCount);
    }

    async create(item: Post): Promise<Post> {
        return Promise.resolve(testPost);
    }

    async update(id: string, update: {}, populate?: string) {
        return Promise.resolve(testPost);
    }

    async delete(id: string, populate?: string): Promise<Post> {
        return Promise.resolve(testPost);
    }
}
