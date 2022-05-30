import { Injectable } from '@nestjs/common';
import { IGenericDataRepository } from '../../../../../src/core/abstracts/generic-data-repository.abstract';
import { Post } from '../../../../../src/frameworks/data/mongo/model/post.model';

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
        const users: any = undefined;
        return users as Promise<Post[]>;
      }

    async get(id: string): Promise<Post> {
        const user: any = undefined;
        return user as Promise<Post>;
    }

    async findOne(criterias: {}): Promise<Post> {
        const user: any = undefined;
        return user as Promise<Post>;
    }

    async findMany(criterias: {}): Promise<Post[]> {
        const users: any = undefined;
        return users as Promise<Post[]>;
    }

    async findManyCount(criterias: {}): Promise<number> {
        const count: any = undefined;
        return count as Promise<number>;
    }

    async findManyCountForSubDocumentId(subDocumentName: string, subDocumentId: string): Promise<number> {
        const count: any = undefined;
        return count as Promise<number>;
    }

    async create(item: Post): Promise<Post> {
        const user: any = undefined;
        return user as Promise<Post>;
    }

    async update(id: string, update: {}, populate?: string) {
        const user: any = undefined;
        return user as Promise<Post>;
    }

    async delete(id: string, populate?: string): Promise<Post> {
        const user: any = undefined;
        return user as Promise<Post>;
    }
}
