import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Public()
  @Get('send')
  sendMai(@Query('email') email: string) {
    return this.mailService.sendWelcomeEmail(email);
  }
}
