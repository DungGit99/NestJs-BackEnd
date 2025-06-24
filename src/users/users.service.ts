import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { hashPasswordHelper } from 'src/helpers/util';
import { Public } from 'src/common/decorators/public.decorator';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
  // 📌 Tạo user mới
  @Public()
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, ...rest } = createUserDto;
    // check exist username , email
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      throw new BadRequestException('Username đã tồn tại');
    }
    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email đã được sử dụng')
    }
    //
    const hashedPassword = await hashPasswordHelper(password)
    const createdUser = new this.userModel({
      ...rest, username,
      email, password: hashedPassword,
      codeId: uuidv4(),
      codeExpired: dayjs().add(15, 'minutes'),
    });
    return createdUser.save();
  }

  // 📌 Lấy danh sách user
  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec(); // bỏ password
  }
  // 📌 Tìm user theo ID
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException('User không tồn tại');
    return user;
  }
  // 📌 Cập nhật user
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    }).exec();
    if (!user) throw new NotFoundException('User không tồn tại');
    return user;
  }
  // 📌 Xoá user
  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
  }

  async findByUsername(username:string): Promise<User>{
    const user = await this.userModel.findOne({username})
    if(!user) throw new NotFoundException('User không tồn tại');
    return user 
  }
}
