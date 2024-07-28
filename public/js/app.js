class Sidebar {
    constructor(){
        this.activateBtn = document.querySelector('.sidebar-btn')
        this.sidebar = document.querySelector('.sidebar')
        this.innerContainer = document.querySelector('.tasks-main-wrapper ')
        this.booleans = {
            isSidebarOpen:false
        }
    }
    handleSidebar = () =>{
        if(!this.booleans.isSidebarOpen){
            this.sidebar.classList.remove('w-[55px]')
            this.sidebar.classList.add('w-1/5')
            this.innerContainer.classList.add('min-w-[80%]')
            this.innerContainer.classList.remove('min-w-[94%]')
            this.booleans.isSidebarOpen = true
        }else{
            this.sidebar.classList.remove('w-1/5')
            this.sidebar.classList.add('w-[55px]')
            this.innerContainer.classList.remove('min-w-[80%]')
            this.innerContainer.classList.add('min-w-[94%]')
            this.booleans.isSidebarOpen = false
        }
    }
    activate = () =>{
        if(this.activateBtn){
            this.activateBtn.addEventListener('click',this.handleSidebar)
        }
    }
}

class TaskDetails {
    constructor(){
        this.booleans = {
            isCompleted:false
        }
        this.output = document.querySelector('.details-output')
        this.pendingHTML = `<div class="absolute right-2 -top-[5px] bg-green-300 py-1 px-2 rounded-md italic text-black">Completed</div>`
        this.completedHTML = `<div class="absolute right-2 -top-[5px] bg-orange-300 py-1 px-2 rounded-md italic text-black">Pending</div>`
    }
    getTask = async() =>{
        const cookies = document.cookies.split(";")
        const regex = /task_id/
        const cookie = cookies.find(c => regex.test(c))
        const parsedCookieValue = cookie.split('=')[1] 
        const res = await fetch(`/tasks/${parsedCookieValue}`)
        const data = await res.json()
        if(data.completed){
            this.booleans.isCompleted = true
        }else{
            this.booleans.isCompleted = false
        }
    }
   
    handleOutput = () =>{
        if(this.booleans.isCompleted){
            this.output.innerHTML = this.completedHTML
        }else{
            this.output.innerHTML = this.pendingHTML
        }
    }
    activate = () =>{
        this.output.addEventListener('click',async()=>{
            await this.getTask()
            const res = await fetch(`/tasks/${task_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !this.booleans.isCompleted }),
            })
            const cookies = document.cookies.split(";")
            const regex = /task_id/
            const cookie = cookies.find(c => regex.test(c))
            const parsedCookieValue = cookie.split('=')[1] 
            const taskRes = await fetch(`/tasks/${parsedCookieValue}`)
            const task = await taskRes.json()
            if(task.completed){
                this.booleans.isCompleted = true
            }else{
                this.booleans.isCompleted = false
            }
            this.handleOutput()
        })
    }
}

class Application {
    constructor(){
        this.sidebar = new Sidebar()
        this.task_details = new TaskDetails()
    }
    handleApp(){
        this.sidebar.activate()
        this.task_details.activate()
    }
}

const app = new Application()

app.handleApp()