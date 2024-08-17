import { Body, Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';


@Controller('chat')
export class ChatController {
    constructor(private chatService:ChatService,private usersService:UsersService){}
    @Get('')
    @Render('chat')
    async getChat(@Req() req, @Res() res){
        const active_room = req.cookies['active-room']
        res.cookie('active-reciver',null,{ httpOnly:true })
        res.cookie('current-reciver_id',null,{ httpOnly:true })
        const users = await this.usersService.getUsers()
        let contacts = await this.chatService.getContacts(Number(1))
        contacts = contacts.filter(id => id !== null).filter(id => id !== 1).map(async(id) =>{
            // to fix
            const user = await this.usersService.getUserById(Number(id))
            if(user){
                return {
                    id:user.id,
                    email:user.email
                }
            }
        })
        const awaited_contacts = await Promise.all(contacts)
        const rooms = this.chatService.getRooms(Number(1))
        let messages = await this.chatService.getMessages()
        messages = messages.filter(m => m.room_id === null)
        if(active_room){
            console.log(active_room)
            messages = await this.chatService.getRoomMessages(Number(active_room))
        }
        return {
            user:users[0],  
            users:users.filter(u => u.id !== 1),
            contacts:awaited_contacts,
            messages,
            rooms,
        }
    }

    @Get('/recived/json/:sender_id')
    async getRecivedJSON(@Res() res,@Param('sender_id') sender_id){
        const messages = await this.chatService.getRecivedMessagesToUser(Number(sender_id))
        return res.json([...messages])
    }

    @Get('/set-reciver/:id')
    setReciver(@Param('id') id,@Res() res){
        res.cookie('active-reciver',id,{ httpOnly:true })
        res.cookie('current-reciver_id',id,{ httpOnly:true })

        return res.json({url:`/chat/private/${1}/${id}`})
    }

    @Get('/private/:sender_id/:reciver_id')
    @Render('chat')
    async getPrivateMessages(@Param('sender_id') sender_id,@Param('reciver_id') reciver_id){
        const users = await this.usersService.getUsers()
        const messages = await this.chatService.getPrivateMessages(Number(sender_id),Number(reciver_id))
        let contacts = await this.chatService.getContacts(Number(sender_id))
        contacts = contacts.filter(id => id !== null).filter(id => id !== 1).map(async(id) =>{
            const user = await this.usersService.getUserById(id)
            if(user){
                return {
                    id:user.id,
                    email:user.email
                }
            }
        })
        const awaited_contacts = await Promise.all(contacts)
        return {
            user:users[0],
            users:users.filter(u => u.id !== 1),
            contacts:awaited_contacts,
            messages,
        }
    }
    @Post('/send')
    async sendMessage(@Body() body,@Res() res){
        await this.chatService.sendMessage(body)
        console.log(body)
        res.redirect('/chat')
    }
    @Post('/clear-private-messages')
    async clearPrivateMessages(@Body() body,@Res() res){
        const { sender_id , receiver_id } = body
        await this.chatService.clearPrivateMessages(sender_id,receiver_id)
        res.redirect('/chat')
    }
    @Get('/room')
    @Render('chat')
    async getRoomContacts(@Param('room_id') room_id,@Param('sender_id') sender_id){
        const users = await this.usersService.getUsers()
        let contacts = await this.chatService.getRoomContacts(Number(room_id))
        contacts = contacts.filter(id => id !== null).map(async(id) =>{
            const user = await this.usersService.getUserById(Number(id))
            return {
                id:user.id,
                email:user.email
            }
        })
        const awaited_contacts = Promise.all(contacts)
        const rooms = this.chatService.getRooms(Number(sender_id))
        let messages = []
        if(room_id){
            messages = await this.chatService.getRoomMessages(Number(room_id))
        }
        return {
            user:users[0],
            users:users.filter(u => u.id !== 1),
            contacts:awaited_contacts,
            messages,
            rooms,
        }
    }
    @Get('/contacts/json')
    @Render('chat')
    async getContacts(@Param('sender_id') sender_id){
        let contacts = await this.chatService.getContacts(Number(sender_id))
        contacts = contacts.filter(id => id !== null).filter(id => id !== 1).map(async(id) =>{
            const user = await this.usersService.getUserById(Number(id))
            return {
                id:user.id,
                email:user.email
            }
        })
        const awaited_contacts = Promise.all(contacts)
        return {
            contacts:awaited_contacts
        }
    }
    
}