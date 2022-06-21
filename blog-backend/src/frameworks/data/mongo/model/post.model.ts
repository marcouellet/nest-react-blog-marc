import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Category } from './category.model';
import { User } from './user.model';
import { minimumPostTitleLength, minimumPostDescriptionLength, minimumPostBodyLength } from '../../../../core/entities/post.entity';

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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
  @Prop({ type: Date, default: Date.now })
  publishDate: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
