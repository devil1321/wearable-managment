import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService  {
    constructor(private prismaService:PrismaService){}
    async getTasks(user_id:number){
        const tasks = await this.prismaService.task.findMany({
            where:{
                user_id:user_id
            }
        })
        const data = await tasks
        return data.sort((a, b) => Number(a.completed) - Number(b.completed));
    }
    async getTask(id:number){
        return await this.prismaService.task.findFirst({
            where:{
                id:id
            }
        })
    }
    async createTask(task){
        await this.prismaService.task.create({
            data:{
                ...task
            }
        })
        return this.getTasks(task.user_id)
    }
    async updateTask(id,updatedTask){
        await this.prismaService.task.update({
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
        const task = await this.prismaService.task.findFirst({
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
        await this.prismaService.task.delete({
            where:{
                id:id
            }
        })
        return await this.getTasks(user_id)
    }
}
