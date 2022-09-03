import { Prop } from '@nestjs/mongoose';
import { ImageData } from 'shared/interfaces';

export class Image implements ImageData {
  @Prop({ type: String })
  base64: string;
  @Prop({ type: String })
  contentType: string;
}
