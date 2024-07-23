import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailsModule } from './emails/emails.module';
import { ProfileModule } from './profile/profile.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [EmailsModule,ProfileModule,TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
