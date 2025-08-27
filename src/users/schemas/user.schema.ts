import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

// Interface for User without sensitive fields
export interface IUser {
  name: string;
  email: string;
  role: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

@Schema({ timestamps: true })
export class User implements IUser {
  @Prop({ trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ enum: ['admin', 'candidate', 'interviewer'], default: 'candidate' })
  role: string;

  @Prop({ select: false })
  refreshToken?: string;

  // Virtual method to match password
  async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add instance method to schema
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};
