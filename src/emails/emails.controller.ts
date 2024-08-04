import { Controller, Get,Render, Req, Res} from '@nestjs/common';
import { EmailsService } from './emails.service';


@Controller('emails')
export class EmailsController {
    constructor(private emailsService:EmailsService){}
    @Get('')
    @Render('emails')
    async getEmails(@Req() req){
        const smtp_id = req.cookies['active-smtp'] ? Number(req.cookies['active-smtp']) : 0
        const emails = await this.emailsService.fetchEmails(2)
        console.log(emails)
        return {
            emails:emails
        }
    }
    @Get('/json')
    async getEmailsJSON(@Req() req, @Res() res){
        const smtp_id = req.cookies['active-smtp'] ? Number(req.cookies['active-smtp']) : 0
        const emails = await this.emailsService.fetchEmails(2)
        res.json([...emails])
    }
}
