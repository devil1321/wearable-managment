import { Controller, Get, Render } from '@nestjs/common';

  const users = [
    {
        id:1,
        email:'s.dominik1321@gmail.com'
    },
    {
        id:2,
        email:'s.dominik1321@outlook.com'
    }
  ]

  const messages = [
    
    {
        id:1,
        message:"Test 1",
        sender_id:1,
        receiver_id:2,
        room_id:null    // Nullable, since a message may or may not be associated with a room  
    },
    {
        id:2,
        message:"Test 2",
        sender_id:2,
        receiver_id:1,
        room_id:null    // Nullable, since a message may or may not be associated with a room  
    },
    {
        id:3,
        message:"Room 2",
        sender_id:1,
        receiver_id:null,
        room_id:1    // Nullable, since a message may or may not be associated with a room  
    },
    {
        id:4,
        message:"Room 1",
        sender_id:2,
        receiver_id:null,
        room_id:1    // Nullable, since a message may or may not be associated with a room  
    },
  ]

  const rooms = [
    {
        id:1,
        name:"Room DB",
    }
  ]

@Controller('chat')
export class ChatController {
    @Get('')
    @Render('chat')
    getChat(){
        return {
            user:users[0],
            users,
            messages,
            rooms,

        }
    }
}
