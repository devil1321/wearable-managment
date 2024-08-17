import { Controller, Get, Render } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TasksService } from 'src/tasks/tasks.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService:AnalyticsService,private tasksService:TasksService){}
    @Get('')
    @Render('analytics')
    async getAnalytics(){
        const tasks = await this.tasksService.getTasks(1)
        const groupedTasks = tasks.reduce((acc, task) => {
            const taskDate = undefined // need date field
        
            // Check if the date already exists in the accumulator
            const existingGroup = acc.find(group => group.date === taskDate);
        
            if (existingGroup) {
                // If date exists, push the task into the tasks array of that group
                existingGroup.tasks.push(task);
            } else {
                // If date doesn't exist, create a new group with the date and task
                acc.push({ date: taskDate, tasks: [task] });
            }
        
            return acc;
        }, []);

        let active = groupedTasks.map(t => { 
            let tasks = t.tasks
            tasks = tasks.filter(t => t.completed === false)
            return tasks
        }).map(t => t.length)

        if(active.length > 0){
            active = active.reduce((a,b) => a + b)
        }else{
            active = [0]
        }

        let completed = groupedTasks.map(t => { 
            let tasks = t.tasks
            tasks = tasks.filter(t => t.completed === true)
            return tasks
        }).map(t => t.length)
       
        if(completed.length > 0){
            completed = completed.reduce((a,b) => a + b)
        }else{
            completed = [0]
        }

        return { 
            tasks:tasks.length,
            active,
            completed
        }
    }
}

