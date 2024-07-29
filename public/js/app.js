class Cookie {
    static cookies = document.cookie.split(";")
    static getCookie = (name) =>{
        let cookies = {}
        Cookie.cookies.forEach(c =>{
            const current = c.split("=")
            cookies[current[0].trim()] = current[1]
        })
        console.log(cookies)
        return cookies[name]
    }
    static setCookie = (name,value, days) => {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        const cookie = name + '=' + (value ? value : '') + '; expires=' + date.toUTCString() + '; path=/'
        document.cookie = cookie
    }
    static removeCookie = (name) =>{
        document.cookie = name + '=; Max-Age=-99999999;';
    }
}
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