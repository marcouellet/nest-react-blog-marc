import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.model';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: true, unique: true })
  description: string;
  @Prop({ required: true, unique: true })
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop()
  publishDate: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
