import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailsModule } from './emails/emails.module';
import { ProfileModule } from './profile/profile.module';
import { TasksModule } from './tasks/tasks.module';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [AuthModule,AnalyticsModule,EmailsModule,TasksModule,OrdersModule,ChatModule,ProfileModule,PassportModule.register({ defaultStrategy: 'local' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
