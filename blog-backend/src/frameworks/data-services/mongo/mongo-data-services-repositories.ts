import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataServicesRepositories, IGenericDataServicesRepository } from '../../../core';
import { MongoGenericDataServicesRepository } from './mongo-data-services-generic-repository';
import {
  Author,
  AuthorDocument,
  Post,
  PostDocument,
} from './model';

@Injectable()
export class MongoDataServicesRepositories extends IDataServicesRepositories implements OnApplicationBootstrap
{
  override authors: IGenericDataServicesRepository<Author>;
  override posts: IGenericDataServicesRepository<Post>;

  constructor(
    @InjectModel(Author.name)
    private AuthorRepository: Model<AuthorDocument>,
    @InjectModel(Post.name)
    private PostRepository: Model<PostDocument>,
  ) {super();}

  onApplicationBootstrap() {
    this.authors = new MongoGenericDataServicesRepository<Author>(this.AuthorRepository);
    this.posts = new MongoGenericDataServicesRepository<Post>(this.PostRepository, ['author']);
  }
}
