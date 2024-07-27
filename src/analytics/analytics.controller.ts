import { Controller, Get, Render } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService:AnalyticsService){}
    @Get('')
    @Render('analytics')
    async getAnalytics(){
        return await this.analyticsService.getAnalytics()    
    }
}

