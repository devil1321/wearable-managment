import { Injectable,UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2'
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategyService extends PassportStrategy(Strategy,'google') {
    constructor(private authService:AuthService){
        super({
            clientID:process.env.CLIENT_ID,
            clientSecret:process.env.CLIENT_SECRET,
            callbackURL:'http://localhost:3000/auth/google/callback',
            scope:['email','profile']
        })
    }
    async validate(accessToken:string,refreshToken:string,profile:any,done:VerifyCallback):Promise<any> {
        const user = await this.authService.validateGoogle(profile)
        if(!user){
            throw new UnauthorizedException()
        }
        done(null, { user, accessToken });
    }
}