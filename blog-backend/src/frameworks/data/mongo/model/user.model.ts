import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { minimumUserNameLength, minimumEmailLength, minimumPasswordLength } from '../../../../core/entities/user.entity';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true, min: minimumUserNameLength })
  username: string;

  @Prop({ type: String, required: true, unique: true, min: minimumEmailLength })
  email: string;

  @Prop({ type: String, required: true, min: minimumPasswordLength })
  password: string;

  @Prop({ type: String, required: true, enum: ['user', 'admin'] })
  role: string;

  @Prop({ type: Date, default: Date.now })
  createdOn: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
