class Sidebar {
    constructor(){
        this.activateBtn = document.querySelector('.sidebar-btn')
        this.sidebar = document.querySelector('.sidebar')
        this.booleans = {
            isSidebarOpen:false
        }
    }
    handleSidebar = () =>{
        if(!this.booleans.isSidebarOpen){
            this.sidebar.classList.remove('w-[55px]')
            this.sidebar.classList.add('w-1/5')
            this.booleans.isSidebarOpen = true
        }else{
            this.sidebar.classList.remove('w-1/5')
            this.sidebar.classList.add('w-[55px]')
            this.booleans.isSidebarOpen = false
        }
    }
    activate = () =>{
        this.activateBtn.addEventListener('click',this.handleSidebar)
    }
}

class Application {
    constructor(){
        this.sidebar = new Sidebar()
    }
    handleApp(){
        this.sidebar.activate()
    }
}

const app = new Application()

app.handleApp()