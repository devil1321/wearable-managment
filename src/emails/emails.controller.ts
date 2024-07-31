import { Controller, Get,Render, Req} from '@nestjs/common';
import { EmailsService } from './emails.service';


@Controller('emails')
export class EmailsController {
    constructor(private emailsService:EmailsService){}
    @Get('')
    @Render('emails')
    async getEmails(@Req() req){
        const smtp_id = req.cookies['smtp-id'] ? Number(req.cookies['smtp-id']) : 0
        const emails = await this.emailsService.fetchEmails(smtp_id)
        return {
            emails:emails
        }
    }
}
