import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategyService } from './google-strategy/google-strategy.service';
import { LocalStrategyService } from './local-strategy/local-strategy.service';
import { UsersService } from 'src/users/users.service';
import * as passport from 'passport'

@Module({
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategyService,LocalStrategyService,UsersService]
})
export class AuthModule {
  constructor(private authService: AuthService) {}

  configure(consumer: MiddlewareConsumer) {
    passport.serializeUser((user: any, done) => {
      done(null, user); // Serialize user's ID
    });

    passport.deserializeUser(async (user: any, done) => {
      done(null, user);
    });
  }
}
