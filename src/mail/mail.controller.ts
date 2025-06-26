import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Public()
  @Get('send')
  sendPasswordResetEmail(@Query('email') email: string, token: string) {
    return this.mailService.sendPasswordResetEmail(email, token);
  }
}
