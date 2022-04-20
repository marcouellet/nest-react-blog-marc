import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Author } from './';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true, unique: true })
  title: String;
  @Prop({ required: true, unique: true })
  description: String;
  @Prop({ required: true, unique: true })
  body: String;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true })
  author: Author;

  @Prop()
  publishDate: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
