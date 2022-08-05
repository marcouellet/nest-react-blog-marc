import { Prop } from '@nestjs/mongoose';

import { ImageData } from '../../../../core/interfaces';

export class Image implements ImageData {
  @Prop({ type: String })
  base64: string;
  @Prop({ type: String })
  contentType: string;
}
