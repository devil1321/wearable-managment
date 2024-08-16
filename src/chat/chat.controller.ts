import { Body, Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';


@Controller('chat')
export class ChatController {
    constructor(private chatService:ChatService,private usersService:UsersService){}
    @Get('')
    @Render('chat')
    async getChat(@Req() req){
        const active_room = req.cookies['active-room']
        const active_reciver = req.cookies['active-reciver']
        const users = await this.usersService.getUsers()
        let contacts = await this.chatService.getContacts(Number(1))
        // contacts = contacts.map(async(m) =>{
        //     // to fix
        //     // const user = await this.usersService.getUserByEmail(m.email)
        //     return {
        //         id:user.id,
        //         email:user.email
        //     }
        // })
        const rooms = this.chatService.getRooms(Number(1))
        let messages = await this.chatService.getMessages()
        if(active_room){
            console.log(active_room)
            messages = await this.chatService.getRoomMessages(Number(active_room))
        }
        if(active_reciver){
            messages = await this.chatService.getPrivateMessages(Number(1),Number(active_reciver))
        }
    
        return {
            user:users[0],
            users,
            contacts:[],
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
        return res.json({url:`/chat/private/${1}/${id}`})
    }

    @Get('/private/:sender_id/:reciver_id')
    @Render('chat')
    async getPrivateMessages(@Param('sender_id') sender_id,@Param('receiver_id') receiver_id){
        const users = await this.usersService.getUsers()
        const messages = await this.chatService.getPrivateMessages(Number(sender_id),Number(receiver_id))
        let contacts = await this.chatService.getContacts(Number(sender_id))
        contacts = contacts.map(async(m) =>{
            const user = await this.usersService.getUserById(m?.reciver_id ? Number(m.reciver_id) : 0)
            if(user){
                return {
                    id:user.id,
                    email:user.email
                }
            }
        })
        return {
            user:users[0],
            users,
            contacts,
            messages,
        }
    }
    @Post('/send')
    async sendMessage(@Body() body,@Res() res){
        await this.chatService.sendMessage(body)
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
        contacts = contacts.map(async(m) =>{
            const user = await this.usersService.getUserById(Number(m.id))
            return {
                id:user.id,
                email:user.email
            }
        })
        const rooms = this.chatService.getRooms(Number(sender_id))
        let messages = []
        if(room_id){
            messages = await this.chatService.getRoomMessages(Number(room_id))
        }
        return {
            user:users[0],
            users,
            contacts,
            messages,
            rooms,
        }
    }
    @Get('/contacts/json')
    @Render('chat')
    async getContacts(@Param('sender_id') sender_id){
        let contacts = await this.chatService.getContacts(Number(sender_id))
        contacts = contacts.map(async(m) =>{
            const user = await this.usersService.getUserById(Number(m.id))
            return {
                id:user.id,
                email:user.email
            }
        })
        return {
            contacts
        }
    }
    
}