import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TasksService } from 'src/tasks/tasks.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService,TasksService]
})
export class AnalyticsModule {}
