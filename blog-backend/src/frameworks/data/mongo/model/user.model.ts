import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { minimumUserNameLength, minimumUserEmailLength, minimumUserPasswordLength } from '../../../../core/entities/user.entity';
import { Optional } from '@nestjs/common';
import { Image } from './image.model';

export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop({ type: String, required: true, min: minimumUserNameLength })
  username: string;

  @Prop({ type: String, required: true, unique: true, min: minimumUserEmailLength })
  email: string;

  @Prop({ type: String, required: true, min: minimumUserPasswordLength })
  password: string;

  @Prop({ type: String, required: true, enum: ['user', 'admin'] })
  role: string;

  @Optional()
  @Prop({ type: Image, required: false })
  image: Image;
}

export const UserSchema = SchemaFactory.createForClass(User);
