import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Optional } from '@nestjs/common';
import { minimumPostTitleLength, minimumPostDescriptionLength, minimumPostBodyLength } from '@Shared/entities';

import { Category } from './category.model';
import { User } from './user.model';
import { Image } from './image.model';

export type PostDocument = Post & Document;
@Schema()
export class Post {
  @Prop({ type: String, required: true, min: minimumPostTitleLength })
  title: string;
  @Prop({ type: String, required: true, min: minimumPostDescriptionLength })
  description: string;
  @Prop({ type: String, required: true, min: minimumPostBodyLength })
  body: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false })
  category: Category;
  @Optional()
  @Prop({ type: Image, required: false })
  image: Image;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
  @Prop({ type: Date, default: Date.now })
  publishDate: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
