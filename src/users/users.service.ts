import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.userModel.findOne({ email: dto.email }).lean();
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ name: dto.name, email: dto.email, passwordHash });
    return user.save();
  }

  async findByEmail(email: string, withPassword = false): Promise<UserDocument | null> {
    if (withPassword) {
      return this.userModel.findOne({ email }).select('+passwordHash').exec();
    }
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Return safe view (without passwordHash) */
  toPublic(user: any) {
    const { _id, name, email, createdAt, updatedAt } = user;
    return { id: _id.toString(), name, email, createdAt, updatedAt };
  }
}
