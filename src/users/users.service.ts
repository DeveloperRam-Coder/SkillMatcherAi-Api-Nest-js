import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

// Type for user response without sensitive fields
export type UserResponse = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userModel.find({}).select('-password -refreshToken').exec();
    return users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  }

  async findById(id: string): Promise<UserResponse> {
    const user = await this.userModel.findById(id).select('-password -refreshToken').exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async update(id: string, updateData: Partial<User>): Promise<UserResponse> {
    const user = await this.userModel.findById(id).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update fields if provided
    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.role !== undefined) user.role = updateData.role;
    if (updateData.password !== undefined) user.password = updateData.password;

    const updatedUser = await user.save();
    
    return {
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };
  }

  async delete(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.deleteOne({ _id: id }).exec();
    
    return { message: 'User removed' };
  }
}
