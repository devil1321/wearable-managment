import { Injectable, OnModuleDestroy,OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    constructor(){
        super()
    }
    async onModuleInit(){
        await this.$connect()
    }
    async onModuleDestroy() {
        await this.$disconnect()
    }
    createUser(profile:any,hash:string):Promise<any>{
        const user = this.user.create({
            data:(function(){
                let data:any = {}
                data = {
                    ...profile,
                    password:hash ? hash : profile.password,
                    isGoogle:profile.isGoogle ? profile.isGoogle : false
                }
                delete data.password_1
                delete data.password_2
                return data
            }())
        })
        return user
    }
    getUsers():Promise<any>{
        const users = this.user.findMany()
        return users
    }
    getUser(email:string):Promise<any>{
        const user = this.user.findUnique({
            where:{
                email:email
            }
        })
        return user
    }
}