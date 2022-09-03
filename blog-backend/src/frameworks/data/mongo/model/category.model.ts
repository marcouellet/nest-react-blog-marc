import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { minimumCategoryTitleLength, minimumCategoryDescriptionLength } from 'shared/entities';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ type: String, required: true, min: minimumCategoryTitleLength })
  title: string;
  @Prop({ type: String, required: true, min: minimumCategoryDescriptionLength })
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
