import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StrategyAuthGuard } from './guards/strategy-login.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Get('register')
    @Render('register')
    getRegister(){
        return null
    }

    @Post('register')
    registerLocal(@Body() profile:any){
        return this.authService.registerLocal(profile)
    }
    
    @Get('login')
    @Render('login')
    getLogin(){
        return null
    }

    @Post('login')
    @UseGuards(StrategyAuthGuard)
    async login(@Req() req, @Res() res){
        return res.redirect('test')
    }   

    @Get('test')
    @UseGuards(AuthenticatedGuard)
    async test(@Req() req){
        console.log('req',req.user)
        return null
    }

    @Get('google')
    @UseGuards(StrategyAuthGuard)
    async googleAuth(){}

    @Get('google/callback')
    @UseGuards(StrategyAuthGuard)
    async googleCallback(@Req() req,@Res() res){
        res.redirect('/')
    }
}