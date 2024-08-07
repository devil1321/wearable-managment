import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { SmtpService } from 'src/smtp/smtp.service';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService,SmtpService]
})
export class EmailsModule {}
