import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper, hashPasswordHelper } from 'src/helpers/util';
import { User } from 'src/users/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
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
    if (!user) {
      throw new NotFoundException('Email không hợp lệ, vui lòng kiểm tra !!!');
    }
    user.codeId = uuidv4();
    user.codeExpired = dayjs().add(15, 'minutes').toDate();
    await user.save();
    const payload = {
      sub: user._id,
      email: user.email,
      codeId: user.codeId,
      codeExpired: user.codeExpired,
    };
    const secret = this.configService.get<string>('JWT_SECRET_KEY');
    const expiresIn = this.configService.get<string>(
      'JWT_RESET_PASSWORD_EXPIRES_IN',
    );
    // ✅ Tạo token mới
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
    await this.mailService.sendPasswordResetEmail(user.email, token);
    return {
      message: 'Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const secret = this.configService.get<string>('JWT_SECRET_KEY');
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
      const user = await this.usersService.findById(payload.sub);
      if (
        user.codeId !== payload.codeId ||
        !user.codeExpired ||
        new Date(user.codeExpired) < new Date()
      ) {
        throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.');
      }
      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại.');
      }
      const hashedPassword = await hashPasswordHelper(newPassword);
      await this.usersService.updatePassword(
        user._id as string,
        hashedPassword,
      );
      // Sau khi đặt lại mật khẩu thành công, vô hiệu hóa codeId trong DB
      await this.usersService.clearUserResetTokenInfo(user._id as string);
      return { message: 'Đặt lại mật khẩu thành công.' };
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.');
    }
  }
}
