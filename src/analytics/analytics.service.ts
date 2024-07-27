import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AnalyticsService extends PrismaClient{
    constructor(){
        super()
    }
    async getAnalytics(){
        return null
    }
}
