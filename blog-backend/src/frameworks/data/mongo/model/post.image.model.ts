import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IPostImage } from '../../../../core/entities/post.entity';

export class PostImage implements IPostImage {
  @Prop({ type: mongoose.Schema.Types.Buffer })
  data: Buffer;
  @Prop({ type: String })
  contentType: String;
}

