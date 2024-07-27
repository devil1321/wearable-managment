import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TasksService extends PrismaClient {
    constructor(){
        super()
    }
    async getTasks(user_id:number){
        return await this.task.findMany({
            where:{
                user_id:user_id
            }
        })
    }
    async getTask(id:number){
        return await this.task.findFirst({
            where:{
                id:id
            }
        })
    }
    async createTask(task){
        await this.task.create({
            data:{
                ...task
            }
        })
        return this.getTasks(task.user_id)
    }
    async updateTask(id,updatedTask){
        await this.task.update({
            where:{
                id:id
            },
            data:{
                ...updatedTask
            }
        })
        return this.getTasks(updatedTask.user_id)
    }
}
