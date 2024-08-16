    import { Body, Controller, Get,Param,Post,Render, Req, Res} from '@nestjs/common';
    import { EmailsService } from './emails.service';
    import { SmtpService } from 'src/smtp/smtp.service';


    @Controller('emails')
    export class EmailsController {
        constructor(private emailsService:EmailsService,private smtpService:SmtpService){}
        @Get('')
        @Render('emails')
        async getEmails(@Req() req){
            const active_id = req.cookies['active-smtp'] ? Number(req.cookies['active-smtp']) : 1
            const emails = await this.emailsService.fetchEmails(Number(active_id))
            const smtps = await this.smtpService.getSMTPS(Number(1))
            const active_smtp = await this.smtpService.getSMTP(Number(active_id))
            return {
                emails:emails,
                smtps:smtps,
                active_smtp:active_smtp
            }
        }
        @Get('/json')
        async getEmailsJSON(@Req() req, @Res() res){
            const smtp_id = req.cookies['active-smtp'] ? Number(req.cookies['active-smtp']) : 0
            try{
                const emails = await this.emailsService.fetchEmails(smtp_id)
                res.json([...emails])
            }catch(err){
                res.json([err])
            }
        }
        @Get('/unseen')
        @Render('emails')
        async getUnseen(@Req() req){
            const emails = await this.emailsService.getUnseen(3)
            const smtps = await this.smtpService.getSMTPS(1)
            const active_id = req.cookies['active-smtp'] ? Number(req.cookies['active-smtp']) : 1
            const active_smtp = await this.smtpService.getSMTP(active_id)
            return {
                emails:emails,
                smtps:smtps,
                active_smtp:active_smtp
            }
        }
        @Get('/unseen/json')
        async getUnseenJSON(@Req() req, @Res() res){
            const active_id = req.cookies['active-smtp'] ? Number(req.cookies['active-smtp']) : 1
            try{            
                const emails = await this.emailsService.getUnseen(active_id)
                res.json([...emails])
            }catch(err){
                res.json([err])
            }
        }
        @Get('/mark/seen/:uid')
        async markEmailRead(@Param('uid') uid,@Req() req, @Res() res){
            const smtp_id = req.cookies['active-smtp'] ? Number(req.cookies['active-smtp']) : 0
            const emails = await this.emailsService.markEmailRead(smtp_id,Number(uid))
            return res.redirect('/emails')
        }
        @Get('/delete/:uid')
        async deleteEmail(@Param('uid') uid,@Req() req, @Res() res){
            const smtp_id = req.cookies['active-smtp'] ? Number(req.cookies['active-smtp']) : 0
            const emails = await this.emailsService.removeEmail(smtp_id,Number(uid))
            return res.redirect('/emails')
        }
        @Post('send')
        async sendMail(@Body() body,@Res() res){
            const isSended = await this.emailsService.sendMail(body)
            return {
                isSended
            }
        }
    }
