import { Body, Controller, Get, Param, Post, Render, Req,UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService:TasksService){

    }
    @Get('')
    @Render('tasks')
    // @UseGuards(AuthenticatedGuard)
    async getTasks(@Req() req){
        const tasks = await this.tasksService.getTasks(1)
        return { tasks }
    }

    @Get(':id')
    // @UseGuards(AuthenticatedGuard)
    @Render('task')
    async getTask(@Param('id') id){
           const tasks = await this.tasksService.getTask(Number(id))
        return { tasks }

    }

    @Post('create')
    // @UseGuards(AuthenticatedGuard)
    @Render('tasks')
    async createTask(@Req() req,@Body() task){
            const tasks = await this.tasksService.createTask({
                ...task
            })
        return { tasks }

    }
    @Post('update')
    // @UseGuards(AuthenticatedGuard)
    @Render('task')
    async updateTask(@Body() body){
        const { id,...task } = body
        const tasks = await this.tasksService.updateTask(Number(id),task)
        return { tasks }

    }
}
