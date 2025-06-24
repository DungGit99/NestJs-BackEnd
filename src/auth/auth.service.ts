import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/util';
import { User } from 'src/users/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    const matchPassword = await comparePasswordHelper(password, user.password);
    if (!user || !matchPassword) {
      return null;
    }
    return user;
  }
  async login(user: User): Promise<any> {
    const payload = { username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      userInfo: {
        username: user.username,
        role: user.role,
      },
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException();
    user.codeId = uuidv4();
    user.codeExpired = dayjs().add(15, 'minutes').toDate();
    await user.save();
    return { message: 'Mật khẩu đã được đặt lại thành công.' };
  }
}
