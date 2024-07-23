import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy,'local') {
    constructor(private authService:AuthService){
        super({
            usernameField:'email'
        })
    }
    async validate(email:string,password:string){
        const user = await this.authService.validateLocal(email,password)
        if(!user){
            throw new UnauthorizedException()
        }
        return user 
    }
}