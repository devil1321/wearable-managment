import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TasksService extends PrismaClient {
    constructor(){
        super()
    }
    async getTasks(user_id:number){
        const tasks = await this.task.findMany({
            where:{
                user_id:user_id
            }
        })
        const data = await tasks
        return data.sort((a, b) => Number(a.completed) - Number(b.completed));
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
    async markCompleted(id){
        const task = await this.task.findFirst({
            where:{
                id:id
            },
        })
        if(task.completed){
            task.completed = false
        }else{
            task.completed = true
        }
        const tasks = await this.updateTask(id,task)
        return tasks
    }
    async delete(id,user_id){
        await this.task.delete({
            where:{
                id:id
            }
        })
        return await this.getTasks(user_id)
    }
}
