import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(to: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Chào mừng bạn!',
      template: 'forgotPassword', // Tên file hbs không cần phần mở rộng
      context: {
        name: to, // sẽ được dùng trong {{name}} của template
        resetLink: '',
        expiresInHours: '15 phút',
        companyName: 'Nestjs',
      },
    });
  }
}
