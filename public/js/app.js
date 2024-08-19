
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
            this.innerContainer.classList.add('min-w-[82%]')
            this.innerContainer.classList.remove('min-w-[97%]')
            this.booleans.isSidebarOpen = true
        }else{
            this.sidebar.classList.remove('w-1/5')
            this.sidebar.classList.add('w-[55px]')
            this.innerContainer.classList.remove('min-w-[82%]')
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
        const res = await fetch(`/${type}/json`)
        const data = await res.json()
        switch(type){
            case 'tasks':
                return [...data.map(t => t.name)]
            case 'emails':
                return [...data.map(t => t.email)]
            case 'chat':
                return [...data.map(t => t.email)]
            default:
                return [...data.map(t => t.name)]
        }
    }

    handleFillMatches = async(e) =>{
        this.data = await this.handleFetchData()
        const regex = new RegExp(`^${e.target.value}`,'gi')
        this.data = this.data.filter(i => regex.test(i))
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
        this.input.addEventListener('input',async(e) => await this.handleFillMatches(e))
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
        if(this.activator){
            this.activator.addEventListener('click',this.handleMenu)
        }
    }
}
class SMTPSearch {
    constructor(){
        this.input = document.querySelector('.smtp-search-input')
        this.search_matches = document.querySelector('.smtp-search-matches')
        this.data = []
        this.booleans = {
            isSearching:false
        }
    }
    createMatch(match){
        const anchor = document.createElement('a')
        anchor.href = `/smtps/${match.id}`
        anchor.classList = 'smtp-search-menu-item hover:text-black block hover:bg-green-300 p-2 rounded-md font-bold'
        anchor.textContent = match.email
        return anchor
    }
    async handleFetchSmtps(){
        const res = await fetch('/smtps/json')
        const data = await res.json()
        return data
    }
    handleSearchActive = () => {
        if(!this.booleans.isSearching){
            this.booleans.isSearching = true
            this.search_matches.classList.remove('hidden')
            setTimeout(() => {
                    this.search_matches.classList.add('px-2')
                    this.search_matches.classList.add('py-3')
                    this.search_matches.classList.remove('opacity-0')
                    this.search_matches.classList.remove('top-[75px]')
                    this.search_matches.classList.add('top-[50px]')

            }, 1);
        }else{
            this.booleans.isSearching = false
            this.search_matches.classList.add('hidden')
            this.search_matches.classList.add('opacity-0')
            this.search_matches.classList.remove('top-[50px]')
            this.search_matches.classList.add('top-[75px]')
            this.search_matches.classList.remove('px-2')
            this.search_matches.classList.remove('py-3')
        }
    }
    handleOutput = async(e) =>{
        this.search_matches.innerHTML = ''
        const regex = new RegExp(`^${e.target.value}`,'gi')
        this.data = await this.handleFetchSmtps()
        this.data = this.data.filter(m => regex.test(m.email))
        this.data.forEach(m =>{
            const el = this.createMatch(m)
            this.search_matches.append(el)
        })
    }
    activate = () =>{
        if(this.input){
            this.input.addEventListener('input',async(e)=>await this.handleOutput(e))
            this.input.addEventListener('focus',this.handleSearchActive)
            this.input.addEventListener('blur',this.handleSearchActive)
        }
    }
}
class SMTPSForm {
    constructor(){
        this.form = document.querySelectorAll('.smtps-form')
        this.current_provider = document.querySelector('.smtp-provider-form-current')
        this.main_input = document.querySelector('.smtp-provider-input')
        this.inputs = document.querySelectorAll('.smtp-provider-form-menu input')
    }
    handleActive = (e) =>{
        this.current_provider.textContent = e.target.value
        this.main_input.value = e.target.value
    }
    handleBigLetter = (string) =>{
        const start_letter = string.slice(0,1).toLocaleUpperCase()
        const rest = string.slice(1,string.length)
        return start_letter + rest
    }
    activate = () =>{
        this.inputs.forEach(i =>i.addEventListener('click',this.handleActive))
        this.inputs.forEach(i => i.value = this.handleBigLetter(i.value))
        const smtp_provider_ui = app.smtp_provider_ui
        this.inputs.forEach(i => i.addEventListener('click',smtp_provider_ui.handleMenu))
    }
}

class Emails {
    constructor(){
        this.emails_main_items = document.querySelector('.emails-main-items')
        this.itemHTML = function(item){
            const sanitizedHTML = DOMPurify.sanitize(item.mail);
            return `<div id="${item.uid}" class="emails-inbox-item hover:bg-neutral-800 p-2 rounded-md flex flex-wrap gap-3 my-2 justify-start items-stretch max-h-max">
                        <div class="w-1/12 flex justify-center items-center bg-orange-300 font-bold text-white rounded-md p-2">${item.uid}</div>
                        <div class="w-[40%] flex justify-center items-center bg-blue-300 font-bold text-white rounded-md p-2">${item.from.html}</div>
                        <div class="w-1/3 flex justify-center items-center bg-green-300 font-bold text-white rounded-md p-2">${item.subject}</div>
                            <a href="/emails/delete/${item.uid}" class="w-1/12 flex justify-center items-center bg-red-600 hover:bg-red-900 font-bold text-white rounded-md p-2">
                                <i class="fa fa-trash fa-2x"></i>
                            </a>
                        <div id="emails-item-details-output-${item.uid}" class="emails-item-details-output  mx-auto max-w-[90%] overflow-x-scroll hidden bg-white rounded-md p-2 w-[90%]">
                            <div class="emails-item-details-output-header bg-neutral-800 p-2 rounded-md>From: ${item.from.html} Subject:${item.subject}</div>  
                            <div>${this.closeUnclosedTags(sanitizedHTML)}</div>
                        </div>
                    </div>`
        }
        this.items = document.querySelectorAll('.emails-inbox-item')
        this.outputs = document.querySelectorAll('.emails-item-details-output')
        this.emails = []
        this.form = document.querySelector('.emails-send-form')
        this.smtp_input = document.querySelector('.emails-smtp-input')
        this.smtp_links = document.querySelectorAll('.emails-smtp-link')
        this.isSendingBtn = document.querySelector('.emails-is-sending-btn')
        this.current_fetch = document.querySelector('.emails-current-fetch')
        this.fetch_menu = document.querySelector('.emails-fetch-menu')
        this.fetch_items = document.querySelectorAll('.emails-fetch-menu-item');
    }
    closeUnclosedTags = (htmlContent) => {
        // Step 1: Close any unclosed <a> tags
        function closeATags(html) {
            if(html){
                return html.replace(/<a\b([^>]*?)(?<!\/)>/gi, function(match) {
                    // Find the closing </a> tag after the opening <a>
                    const closingTagIndex = html.indexOf('</a>', html.indexOf(match));
                    if (closingTagIndex === -1) {
                        // No closing </a> tag found, so close it manually
                        return match + '</a>';
                    }
                    return match;
                });
            }
        }
        // Step 2: Apply the closing function to the content
        const sanitizedHTML = closeATags(htmlContent);
    
        return sanitizedHTML;
    }
    handleFetchEmails = async () =>{
        const res = await fetch('/emails/json')
        const data = await res.json()
        return data
    }
    handleActive = async(e) =>{
        const data =  await this.handleFetchEmails()
        this.outputs.forEach(o => o.style.display = 'none')
        const output = document.querySelector(`#emails-item-details-output-${e.target.id}`)
        if(!output?.classList?.contains('--open')){
            output?.classList?.add('--open')
            output.style.display = 'block'
        }else{
            output?.classList?.remove('--open')
            output.style.display = 'none'
        }
        const details = data.find(i => i.uid === Number(e.target.id))
        output.innerHTML = `<div class="emails-item-details-output-header bg-neutral-800 p-2 rounded-md>From: ${details.from.html} Subject:${details.subject}</div>`+  details.mail
        await this.handleMarkSeen(e.target.id)
    }
    handleMarkSeen = async(uid) =>{
        await fetch('/emails/mark/seen' + uid)
    }
    handleLink = (e) =>{
        this.smtp_input.value = e.target.textContent
    }
    handleForm = () =>{
        if(!this.form.classList.contains('--open')){
            this.form.classList.remove('hidden')
            this.form.classList.add('--open')
        }else{
            this.form.classList.add('hidden')
            this.form.classList.remove('--open')
        }
    }
    handleFetchMenuOpen = () =>{
        if(!this.fetch_menu.classList.contains('--open')){
            this.fetch_menu.classList.add('--open')
            this.fetch_menu.classList.remove('hidden')
            setTimeout(() => {
                this.fetch_menu.classList.remove('opacity-0')
                this.fetch_menu.classList.remove('translate-y-6')
            }, 1);
        }
    }
    handleFetchMenuFetchAndClose = async(e) =>{
        if(this.fetch_menu.classList.contains('--open')){
            this.fetch_menu.classList.remove('--open')
            this.fetch_menu.classList.add('opacity-0')
            this.fetch_menu.classList.add('translate-y-6')
            setTimeout(() => {
                this.fetch_menu.classList.add('hidden')
            }, 1000);
        }
        this.current_fetch.textContent = e.target.dataset.fetch === 'all' ? 'All' : 'Unseen'
        const res = await fetch(`/emails${e.target.dataset.fetch === 'all' ? '' : '/unseen'}/json`)
        const data = await res.json()
        this.emails_main_items.innerHTML = ''
        let htmlString = ''
        data?.forEach(email =>{
            htmlString += this.itemHTML(email)
        })
        this.emails_main_items.innerHTML = htmlString
        this.outputs = document.querySelectorAll('.emails-item-details-output')
        this.items = document.querySelectorAll('.emails-inbox-item')
        this.activate()
    }
    activate = () =>{
        if(this.form){
            this.form.addEventListener('submit',()=>{
                setTimeout(()=>{
                    this.form.reset()
                },1000)
            })
            this.current_fetch.addEventListener('click',this.handleFetchMenuOpen)
            this.fetch_items.forEach(i => i.addEventListener('click',(e) => this.handleFetchMenuFetchAndClose(e)))
            this.isSendingBtn.addEventListener('click',this.handleForm)
            this.smtp_links.forEach(l => l.addEventListener('click',(e) => this.handleLink(e)))
            this.items.forEach(i => i.addEventListener('click',async(e)=> await this.handleActive(e)))
        }
        }
}

class Chat{
    constructor(){
        this.message_form = document.querySelector('.chat-message-form')
        this.message = document.querySelector('.chat-message-input')
        this.sender = document.querySelector('.chat-sender-input')
        this.recivers = document.querySelectorAll('.chat-user')
        this.current_room = null
        this.rooms = document.querySelectorAll('.chat-rooms-menu a')
    }
    handleReciverActivate = async (reciver) =>{
        this.current_reciver = reciver.id
        // if(id === Number(reciver.id)){
            reciver.classList.remove('bg-green-300')
            reciver.classList.remove('bg-orange-300')
            reciver.classList.add("bg-green-600")
        // }
       
    }
    handleReciver = async(e) =>{
        const res = await fetch('/chat/set-reciver/' + e.target.id)
        const data = await res.json()
        const url = await data
        this.recivers.forEach(r => r.classList.remove("bg-orange-300"))
        e.target.classList.add("bg-green-600")
        Cookie.setCookie('current-room',e.target.id,0)
        Cookie.setCookie('current-reciver',e.target.id,7)
        setTimeout(() => {
            if(url.url){
                window.location.href = url.url
            }
        }, 100);
    }
    handleRoom(e){
        Cookie.setCookie('current-room',e.target.id,7)
        Cookie.setCookie('current-reciver',e.target.id,0)
        this.current_room = e.target.id
        this.current_reciver = null
        if(e.target.id === 'undefined'){
            this.current_room = null
        }
    }
    sendMessage = async(e) =>{
        e.preventDefault()
        this.current_reciver = Cookie.getCookie('current-reciver_id')
        this.current_room = Cookie.getCookie('current-room')
        const message = {
            room_id:this.current_room === null ? null : Number(this.current_room),
            message:this.message.value,
            sender_id:Number(this.sender.value),
            receiver_id:this.current_reciver === null ? null : Number(this.current_reciver)
        }
        try{
            await fetch('/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Ensure the body is treated as JSON
                },
                body: JSON.stringify(message)
            });
            this.message_form.reset()
            if(this.current_reciver && !this.current_room){
                window.location.href = `/chat/private/${this.sender.value}/${this.current_reciver}`
            }else if(this.current_room) {
                const res = await fetch('/users/logged-user/json')
                const user = await res.json()
                window.location.href = `/chat/room/${Number(this.current_room)}/${user.id}`
            }else{
                window.location.href = '/chat'
            }
        }catch(err){
            console.log(err)
        }
    }
    activate = () =>{
        if(this.message_form){
            this.message_form.addEventListener('submit',async(e) => await this.sendMessage(e))
            this.recivers.forEach(r => r.addEventListener('click',async(e) => await this.handleReciver(e)))
            this.rooms.forEach(r => r.addEventListener('click',(e) => this.handleRoom(e)))
            this.recivers.forEach(async r => await this.handleReciverActivate(r))
        }
    }
}

class Chart {
    constructor(){
        this.chart = document.querySelector('.analytics-chart')
        this.tasks = []
    }
    getTasks = async () =>{
        const res = await fetch('/tasks/json')
        const data = await res.json()
        return data
    }
    renderChart = (data) =>{
        const groupedTasks = data.reduce((acc, task) => {
            const taskDate = task.date;
        
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

        var options = {
            series: [{
            name: 'All',
            data: [groupedTasks.map(t => t.tasks.length).length]
          }, {
            name: 'Completed',
            data: groupedTasks.map(t => { 
                let tasks = t.tasks
                tasks = tasks.filter(t => t.completed === true)
                return tasks.length
            })
          },{
            name: 'Active',
            data: groupedTasks.map(t => { 
                let tasks = t.tasks
                tasks = tasks.filter(t => t.completed === false)
                return tasks.length
            })
          },
        ],
            chart: {
            height: 350,
            type: 'area'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
          };
        
          var chart = new ApexCharts(this.chart, options);
          chart.render();
    }
    activate = async () =>{
        if(this.chart){
            const data = await this.getTasks()
            await this.renderChart(data)
        }
    }
}

class ChatMenu {
    constructor(){
        this.activator = document.querySelector('.nav-chat-icon-wrapper')
        this.menu_output = document.querySelector('.nav-chat-menu')
    }
    getUsers = async() =>{
        const res = await fetch('/users/json')
        const data = await res.json()
        return data
    }
    getMessages = async(sender_id) =>{
        const res = await fetch(`/chat/recived/json/${sender_id}`)
        const data = res.json()
        return data
    }
    getUser = async(id) =>{
        const res = await fetch(`/users/user/by-id/${id}`)
        const data = await res.json()
        return data
    }
    getLoggedUser = async() =>{
        const res = await fetch('/users/logged-user/json')
        const data = await res.json()
        return data
    }
    handleOutput = async() =>{
        const users = await this.getUsers()
        const sender = await this.getLoggedUser()
        users.filter(u => u.email !== sender.email).length > 0 
        ? users.filter(u => u.email !== sender.email).forEach(async (u) =>{
            const reciver = await this.getUser(u.id)
            console.log(reciver)
            const anchor = document.createElement('a')
            anchor.classList = 'my-2 p-2 bg-neutral-900 hover:bg-green-300 font-bold rounded-md'
            anchor.textContent = reciver.email
            anchor.href = `/chat/private/${sender.id}/${reciver.id}`
            this.menu_output.appendChild(anchor)
        })
        :  this.menu_output.innerHTML = `<div class="my-2 p-2 bg-neutral-900 hover:bg-green-300 font-bold rounded-md">Messages Are Empty</div>`
    }
    activate = () =>{
        if(this.menu_output){
            this.activator.addEventListener('click',this.handleOutput)
        }
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
        this.romms_ui = new Nav_Menu(
                                document.querySelector('.chat-rooms-activator'),
                                document.querySelector('.chat-rooms-menu')
        )
        this.profile_ui = new Nav_Menu(
            document.querySelector('.nav-profile-icon-wrapper'),
            document.querySelector('.nav-profile-menu')
        )
        this.provider_ui = new Nav_Menu(
                                document.querySelector('.search-provider-current'),
                                document.querySelector('.search-provider-menu')
                            )
        this.smtp_provider_ui = new Nav_Menu(
            document.querySelector('.smtp-provider-form-current'),
            document.querySelector('.smtp-provider-form-menu')
        )
        this.smtp_search = new SMTPSearch()
        this.smtp_form = new SMTPSForm()     
        this.emails_ui = new Emails()           
        this.chat = new Chat()
        this.chart = new Chart()
        this.chat_menu = new ChatMenu()
    }
    handleApp(){
        this.sidebar_ui.activate()
        this.nav_ui.activate()
        this.search_ui.activate()
        this.notifications_ui.activate()
        this.chat_ui.activate()
        this.romms_ui.activate()
        this.profile_ui.activate()
        this.provider_ui.activate()
        this.smtp_search.activate()
        this.smtp_provider_ui.activate()  
        this.smtp_form.activate()
        this.emails_ui.activate()
        this.chat.activate()
        this.chart.activate()
        this.chat_menu.activate()
    }
}

const app = new Application()
app.handleApp()