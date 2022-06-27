import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ImageData } from '../../../../core/interfaces';

export class Image implements ImageData {
  @Prop({ type: mongoose.Schema.Types.Buffer })
  data: Buffer;
  @Prop({ type: String })
  contentType: String;
}

