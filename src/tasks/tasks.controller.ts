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

    @Get('json')
    // @UseGuards(AuthenticatedGuard)
    async getTasksJson(@Req() req,@Res() res){
        const tasks = await this.tasksService.getTasks(1)
        res.json([...tasks])
    }

    @Get('/:id')
    // @UseGuards(AuthenticatedGuard)
    async getTask(@Param('id') id,@Req() req,@Res() res){
        res.cookie('current-task',id,{ httpOnly:true })
        return res.redirect('/tasks')
    }

    @Post('create')
    // @UseGuards(AuthenticatedGuard)
    async createTask(@Req() req,@Res() res, @Body() body){
        await this.tasksService.createTask({
            ...body,
            user_id:1
        })
        return res.redirect('/tasks')
    }
    @Post('update/:id')
    // @UseGuards(AuthenticatedGuard)
    async updateTask(@Body() body,@Req() req,@Res() res ,@Param('id') id){
        const taskId = req.cookies['current-task'] ? Number(req.cookies['current-task']) : 1
        const task = await this.tasksService.getTask(taskId)
        const updated = {
            ...task
        }
        updated.name = body.name
        updated.description = body.description
        await this.tasksService.updateTask(Number(id),updated)
        return res.redirect('/tasks')
    }
    @Get('completed/:id')
    // @UseGuards(AuthenticatedGuard)
    async markCompletedTask(@Param('id') id,@Req() req,@Res() res){
        await this.tasksService.markCompleted(Number(id))
        return res.redirect('/tasks')
    }

    @Get('delete/:id')
    async deleteTask(@Param('id') id,@Req() req,@Res() res){
        await this.tasksService.delete(Number(id),1)
        return res.redirect('/tasks')
    }
}
