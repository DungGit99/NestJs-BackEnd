import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Đây là type document MongoDB
export type UserDocument = User & Document;

// Decorator để đánh dấu là Schema
// 📒 @Prop() là gì?
// ✅ @Prop() là một decorator được sử dụng bên trong class để định nghĩa các field (trường) trong một Schema MongoDB.
// Nó là cú pháp rút gọn và typescript-friendly để xây dựng schema với NestJS.
@Schema()
export class User {
  @Prop({ required: true, unique: true }) // Bắt buộc có username
  username: string;

  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  image: string;

  @Prop({ enum: ['ADMIN', 'USER'], efault: 'USER' })
  role: string;

  @Prop({ default: 'LOCAL' })
  accountType: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  codeId: string;

  @Prop()
  codeExpired: Date;
}

// Tạo schema từ class
export const UserSchema = SchemaFactory.createForClass(User);
