import { Injectable } from '@nestjs/common';
import { IGenericDataRepository } from '../../src/core/repositories';
import { Post } from '../../src/core/entities';
import { PostCriterias } from '../../src/core/find-criterias/post.criterias';
import { testPost, testPostCount } from '../data/post.data';
@Injectable()
export class PostRepositoryStub implements IGenericDataRepository<Post> {

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

    async findOne(criterias: PostCriterias): Promise<Post> {
        return Promise.resolve(testPost);
    }

    async findMany(criterias: PostCriterias): Promise<Post[]> {
        return Promise.resolve([testPost]);
    }

    async findManyCount(criterias: PostCriterias): Promise<number> {
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
