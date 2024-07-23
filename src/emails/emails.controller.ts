import { Controller, Get } from '@nestjs/common';
import connectUI from '../states/ui.state';

const UI = connectUI()

@Controller('emails')
export class EmailsController {
    @Get('')
    getStore(){
    }
}
