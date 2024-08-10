import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService{
    constructor(private prismaService:PrismaService){}
   
    async createUser(profile,hash:string):Promise<any>{
        const user = await this.prismaService.user.create({
            data:(function(){
                let data:any = {}
                data = {
                    ...profile,
                    password:hash ? hash : profile.password,
                    isgoogle:profile.isgoogle ? profile.isgoogle : false
                }
                delete data.password_1
                delete data.password_2
                return data
            }())
        })
        return user
    }
    async getUsers():Promise<any>{
        const users = await this.prismaService.user.findMany()
        return users
    }
    async getUserByEmail(email:string):Promise<any>{
        const user = await this.prismaService.user.findUnique({
            where:{
                email:email
            }
        })
        return user
    }
    async getUserById(id:number):Promise<any>{
        const user = await this.prismaService.user.findUnique({
            where:{
                id
            }
        })
        return user
    }
}