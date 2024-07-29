import { Body, Controller, Get, Param, Post, Render, Req,Res,UseGuards } from '@nestjs/common';
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
        const taskId = req.cookies['current-task'] ? Number(req.cookies['current-task']) : 1
        const task = await this.tasksService.getTask(taskId)
        return { tasks,task }
    }

    @Get('/:id')
    // @UseGuards(AuthenticatedGuard)
    @Render('tasks')
    async getTask(@Param('id') id,@Req() req,@Res() res){
        const tasks = await this.getTasks(1)
        res.cookie('current-task',id,{ httpOnly:true })
        const task = await this.tasksService.getTask(Number(id))
        return { task,tasks }

    }

    @Post('create')
    // @UseGuards(AuthenticatedGuard)
    @Render('tasks')
    async createTask(@Req() req,@Body() body){
            const tasks = await this.tasksService.createTask({
                ...body
            })
            const taskId = req.cookies['current-task'] ? Number(req.cookies['current-task']) : 1
            const task = await this.tasksService.getTask(taskId)
        return { tasks,task }
    }
    @Post('update/:id')
    // @UseGuards(AuthenticatedGuard)
    @Render('tasks')
    async updateTask(@Body() body,@Req() req ,@Param('id') id){
        const taskId = req.cookies['current-task'] ? Number(req.cookies['current-task']) : 1
        let task = await this.tasksService.getTask(taskId)
        const updated = {
            ...task
        }
        updated.name = body.name
        updated.description = body.description
        const tasks = await this.tasksService.updateTask(Number(id),updated)
        task = await this.tasksService.getTask(taskId)
        return { tasks,task }
    }
    @Get('completed/:id')
    // @UseGuards(AuthenticatedGuard)
    @Render('tasks')
    async markCompletedTask(@Param('id') id,@Req() req){
        const tasks = await this.tasksService.markCompleted(Number(id))
        const taskId = req.cookies['current-task'] ? Number(req.cookies['current-task']) : 1
        const task = await this.tasksService.getTask(taskId)
        return { tasks,task }
    }

    @Get('delete/:id')
    @Render('tasks')
    async deleteTask(@Param('id') id,@Req() req){
        const tasks = await this.tasksService.delete(Number(id),1)
        const taskId = req.cookies['current-task'] ? Number(req.cookies['current-task']) : 1
        const task = await this.tasksService.getTask(taskId)
        return { tasks,task }
    }
}
