import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { TasksModule } from './tasks/tasks.module';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AnalyticsModule } from './analytics/analytics.module';
import { EmailsModule } from './emails/emails.module';
import { SmtpModule } from './smtp/smtp.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule,UsersModule,AnalyticsModule,EmailsModule,SmtpModule,TasksModule,OrdersModule,ChatModule,ProfileModule,PassportModule.register({ defaultStrategy: 'local' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
