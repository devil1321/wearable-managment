import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import connectUI from './states/ui.state';

const UI = connectUI()


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('emails')
  getHello() {
  }
  @Get('/state')
  getHello2() {
  }
}
