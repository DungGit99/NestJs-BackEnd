import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, token) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Chào mừng bạn!',
      template: 'forgotPassword', // Tên file hbs không cần phần mở rộng
      context: {
        name: email, // sẽ được dùng trong {{name}} của template
        resetLink: `http://localhost:8080/api/auth/reset-password?token=${token}`,
        expiresInHours: '15 phút',
        companyName: 'Nestjs',
      },
    });
  }
}
