import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ trim: true })
  name: string;

  @Prop({ required: [true, 'Please add an email'], unique: true, lowercase: true })
  email: string;

  @Prop({ required: [true, 'Please add a password'], select: false })
  password: string;

  @Prop({ enum: ['admin', 'candidate', 'interviewer'], default: 'candidate' })
  role: string;

  @Prop({ select: false })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
