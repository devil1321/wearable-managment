import { Controller, Get, Res } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService:UsersService){}
    @Get('user/:email')
    async getUser(@Res() res){
        const user = await this.usersService.getUser('s.dominik1321@gmail.com')
        console.log(user)
        return res.json(user)
    }
}
