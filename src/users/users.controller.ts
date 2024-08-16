import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService:UsersService){}

    @Get('/json')
    async getUsers(@Res() res){
        const users = await this.usersService.getUsers()
        return res.json([...users])
    }

    @Get('/user/:email')
    async getUser(@Res() res, @Param('email') email){
        const user = await this.usersService.getUserByEmail(email)
        return res.json({...user})
    }
    @Get('/user/:id')
    async getUserById(@Res() res,@Param('id') id){
        const user = await this.usersService.getUserById(Number(id))
        return res.json({...user})
    }
    @Get('/user/by-id/:id')
    async getUserByIdJSON(@Res() res,@Param('id') id){
        const user = await this.usersService.getUserById(Number(id))
        return res.json({...user})
    }
    @Get('/logged-user/json')
    async getLoggedUser(@Req() req, @Res() res){
        const id = req.cookies['user_id'] ? req.cookies['user_id'] : 1
        const user = await this.usersService.getUserById(Number(1))
        res.json({...user})
    }
}
