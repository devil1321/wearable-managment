import { Body, Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { SmtpService } from './smtp.service';

@Controller('smtps')
export class SmtpController {
    constructor(private smtpService:SmtpService){}
    @Get('')
    @Render('smtps')
    async getSMTPS(/*@Req() req*/){
        const smtps = await this.smtpService.getSMTPS(1)
        return { smtps }
    }

    @Get('register-smtp')
    @Render('register-smtp')
    async getRegisterSMTP(){
        return null
    }

    @Post('register-smtp')
    async postRegisterSMTP(@Res() res,@Body() body){
        const { email, password, provider, user_id } = body
        await this.smtpService.registerSMTP(email,password,provider,user_id)
        return res.redirect('/smtps')
    }
    @Get('set-smtp/:id')
    async setSMTP(@Res() res,@Param('id') id){
        res.cookie('smtp-id',id,{ httpOnly:true })
        return res.redirect('/smtps')
    }

    @Get('smtp-details/:id')
    @Render('smtp-details')
    async getSMTPDetails(/*@Req() req*/@Param('id') id){
        const smtp = await this.smtpService.getSMTP(Number(id))
        return { smtp_details:smtp }
    }

    @Post('update/smtp')
    async updateSMTP(@Res() res,@Req() req,@Body() body){
        const id = 1
        const { email, password, provider } = body
        await this.smtpService.updateSMTP(Number(id),{ email, password, provider })
        return res.redirect(`/smtp/details/${Number(id)}`)
    }
    @Get('delete/:id')
    async deleteSMTP(@Res() res,@Param('id') id){
        await this.smtpService.deleteSMTP(Number(id))
        return res.redirect('/smtps')
    }
}
