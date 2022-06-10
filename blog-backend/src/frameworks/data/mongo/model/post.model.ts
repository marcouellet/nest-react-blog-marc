import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.model';
import { minimumTitleLength, minimumDescriptionLength, minimumBodyLength } from '../../../../core/entities/post.entity';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ type: String, required: true, min: minimumTitleLength })
  title: string;
  @Prop({ type: String, required: true, min: minimumDescriptionLength })
  description: string;
  @Prop({ type: String, required: true, min: minimumBodyLength })
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Date, default: Date.now })
  publishDate: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
