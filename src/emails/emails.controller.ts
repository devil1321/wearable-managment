import { Controller, Get, Render, Req } from '@nestjs/common';


@Controller('emails')
export class EmailsController {
    @Get('')
    @Render('emails')
    getStore(@Req() req){
        console.log(req.user)
    }
}
