import { Body, Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { SmtpService } from './smtp.service';

@Controller('smtps')
export class SmtpController {
    constructor(private smtpService:SmtpService){}
    @Get('')
    @Render('smtps')
    async getSMTPS(@Req() req){
        const active_id = req.cookies['active-smtp'] ? Number(req.cookies['active-smtp']) : 1
        const active_smtp = await this.smtpService.getSMTP(active_id)
        const smtps = await this.smtpService.getSMTPS(1)
        return { smtps:smtps, providers:Object.keys(this.smtpService.smtpSettings), active_smtp:active_smtp }
    }

    @Get('/json')
    async getSMTPJSON(@Res() res){
        const smtps = await this.smtpService.getSMTPS(1)
        res.json([...smtps])
    }

    @Get('/:id')
    async getSMTP(@Param('id') id){
        const smtps = await this.smtpService.getSMTPS(1)
        const smtp = smtps.find(s => s.id === id)
        return { smtp:smtp }
    }

    @Post('register')
    async postRegisterSMTP(@Res() res,@Body() body){
        const { email, password, provider } = body
        await this.smtpService.registerSMTP(email,password,provider[0].toLocaleLowerCase(),1)
        return res.redirect('/smtps')
    }
    @Get('set-smtp/:id')
    async setSMTP(@Res() res,@Param('id') id){
        const smtps = await this.smtpService.getSMTPS(1)
        smtps.forEach(async(i) =>{
            const tmpItem = { ...i }
            tmpItem.is_active = false
            await this.smtpService.updateSMTP(tmpItem.id,tmpItem)
        })
        const smtp = await this.smtpService.getSMTP(Number(id))
        const tmpSmtp = {
            ...smtp
        }
        const updated = {...tmpSmtp,is_active:true} 
        await this.smtpService.updateSMTP(updated.id,updated)
        res.cookie('active-smtp',id,{ httpOnly:true })
        return res.redirect('/smtps')
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
