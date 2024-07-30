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
        this.innerContainer = document.querySelector('.main-wrapper ')
        this.booleans = {
            isSidebarOpen:false
        }
    }
    handleSidebar = () =>{
        if(!this.booleans.isSidebarOpen){
            this.sidebar.classList.remove('w-[55px]')
            this.sidebar.classList.add('w-1/5')
            this.innerContainer.classList.add('min-w-[80%]')
            this.innerContainer.classList.remove('min-w-[97%]')
            this.booleans.isSidebarOpen = true
        }else{
            this.sidebar.classList.remove('w-1/5')
            this.sidebar.classList.add('w-[55px]')
            this.innerContainer.classList.remove('min-w-[80%]')
            this.innerContainer.classList.add('min-w-[97%]')
            this.booleans.isSidebarOpen = false
        }
    }
    activate = () =>{
        if(this.activateBtn){
            this.activateBtn.addEventListener('click',this.handleSidebar)
        }
    }
}
class Nav {
    constructor(){
        this.nav = document.querySelector('.nav')
        this.nav_type_menu_activator = document.querySelector('.nav-type-current')
        this.nav_type_menu = document.querySelector('.nav-type-menu')
        this.booleans = {
            isTypeOpen:false
        }
    }
    handleMenu = () =>{
        if(!this.booleans.isTypeOpen){
                this.booleans.isTypeOpen = true
                this.nav_type_menu.classList.remove('hidden')
                setTimeout(() => {
                    this.nav_type_menu.classList.remove('opacity-0')
                    this.nav_type_menu.classList.remove('translate-y-6')
                    this.nav_type_menu.classList.add('translate-y-0')
                }, 1);
            }else{
                this.booleans.isTypeOpen = false
                this.nav_type_menu.classList.add('opacity-0')
                this.nav_type_menu.classList.remove('translate-y-0')
                this.nav_type_menu.classList.add('translate-y-6')
                setTimeout(() => {
                    this.nav_type_menu.classList.add('hidden')
                },150);
            }
        
    }
    activate = () =>{
        this.nav_type_menu_activator.addEventListener('click',this.handleMenu)
    }
}
class Search{
    constructor(){
        this.search = document.querySelector('.nav-search')
        this.input = document.querySelector('.nav-search-form-field input')
        this.search_matches = document.querySelector('.nav-search-matches')
        this.data = []
        this.booleans = {
            isSearching:false
        }
    }

    handleFetchData = async () =>{
        const type = new Nav().nav_type_menu_activator.textContent.toLocaleLowerCase()
        const res = await fetch(`/search/${type}`)
        const data = await res.json()
        this.data = data    
    }

    handleFillMatches = () =>{
        this.search_matches.innerHTML = ''
        this.data.forEach(match => {
            const type = new Nav().nav_type_menu_activator.textContent.toLocaleLowerCase()
            const anchor = document.createElement('a')
            anchor.href = `/${type}/${match.toLocaleLowerCase()}`
            anchor.textContent = match
            anchor.classList = 'nav-search-menu-item hover:text-white block hover:bg-green-300 p-2 rounded-md font-bold'
            this.search_matches.append(anchor)
        })
    }

    handleSearchActive = () => {
        if(!this.booleans.isSearching){
            this.booleans.isSearching = true
            this.search_matches.classList.remove('hidden')
            setTimeout(() => {
                    if(this.data.length > 0){
                        this.handleFillMatches()
                    }
                    this.search_matches.classList.add('px-2')
                    this.search_matches.classList.add('py-3')
                    this.search_matches.classList.remove('opacity-0')
                    this.search_matches.classList.remove('translate-y-6')
            }, 1);
        }else{
            this.booleans.isSearching = false
            this.search_matches.classList.add('hidden')
            this.search_matches.classList.add('opacity-0')
            this.search_matches.classList.add('translate-y-6')
            this.search_matches.classList.remove('px-2')
            this.search_matches.classList.remove('py-3')
        }
    }
    activate = () =>{
        this.input.addEventListener('focus',this.handleSearchActive)
        this.input.addEventListener('blur',this.handleSearchActive)
        this.input.addEventListener('input',async() => await this.handleFetchData())
    }
}
class Nav_Menu{
    constructor(activator,menu) {
        this.activator = activator
        this.menu = menu
        this.booleans = {
            isOpen:false
        }
    }
    handleMenu = () =>{
        if(!this.booleans.isOpen){
            this.booleans.isOpen = true
            this.menu.classList.remove('hidden')
            setTimeout(() => {
                this.menu.classList.remove('opacity-0')
                this.menu.classList.remove('translate-y-6')
                this.menu.classList.add('translate-y-0')    
            }, 100);
        }else{
            this.booleans.isOpen = false
            this.menu.classList.remove('translate-y-0')
            this.menu.classList.add('opacity-0')
            this.menu.classList.add('translate-y-6')
            setTimeout(() => {
                this.menu.classList.add('hidden')
            },150);
        }
    }
    activate = () =>{
        this.activator.addEventListener('click',this.handleMenu)
    }
}

class Application {
    constructor(){
        this.sidebar_ui = new Sidebar()
        this.nav_ui = new Nav()
        this.search_ui = new Search()
        this.notifications_ui = new Nav_Menu(
                                document.querySelector('.nav-notifications-icon-wrapper'),
                                document.querySelector('.nav-notifications-menu')
                            )
        this.chat_ui = new Nav_Menu(
                                document.querySelector('.nav-chat-icon-wrapper'),
                                document.querySelector('.nav-chat-menu')
                            )
        this.profile_ui = new Nav_Menu(
                                document.querySelector('.nav-profile-icon-wrapper'),
                                document.querySelector('.nav-profile-menu')
                            )
    }
    handleApp(){
        this.sidebar_ui.activate()
        this.nav_ui.activate()
        this.search_ui.activate()
        this.notifications_ui.activate()
        this.chat_ui.activate()
        this.profile_ui.activate()
    }
}

const app = new Application()

app.handleApp()