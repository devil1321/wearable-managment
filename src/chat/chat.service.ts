import { Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prismaService:PrismaService){}
    async getMessages(){
        let messages = await this.prismaService.message.findMany({})
        messages = messages.filter(m => m.room_id === null)
        return messages
    }
    async getRoomMessages(room_id){
        const messages = await this.prismaService.message.findMany({
            where:{
                room_id
            }
        })
        return messages
    }
    async getPrivateMessages(sender_id,receiver_id){
        const messages = await this.prismaService.message.findMany({
            where:{
                sender_id:sender_id,
                receiver_id:receiver_id
            }
        })
        return messages
    }
    async getRecivedMessagesToUser(sender_id){
        const messages = await this.prismaService.message.findMany({
            where:{
                sender_id
            }
        })
        return messages
    }
    async sendMessage(message){
        const sended_message = await this.prismaService.message.create({
            data:message
        })
        return sended_message
    }
    async clearPrivateMessages(sender_id,receiver_id){
        const cleared = this.prismaService.message.deleteMany({
            where:{
                sender_id,
                receiver_id
            }
        })
        return cleared
    }
    async getContacts(sender_id){
        const allMessages = await this.prismaService.message.findMany({
            where:{
                sender_id,
            },
            orderBy: [
              { receiver_id: 'asc' },
            ],
          });

          const uniqueMessages = [];
          const seenReceiverIds = new Set();

          for (const message of allMessages) {
            if (!seenReceiverIds.has(message.receiver_id)) {
                uniqueMessages.push(message);
                seenReceiverIds.add(message.receiver_id);
            }
        }
        return uniqueMessages.map(m => m.receiver_id)
    }
    async getRoomContacts(room_id){
        const allMessages = await this.prismaService.message.findMany({
            where:{
                room_id
            },
            orderBy: [
              { receiver_id: 'asc' },
            ],
          });

          const uniqueMessages = [];
          const seenReceiverIds = new Set();

          for (const message of allMessages) {
            if (!seenReceiverIds.has(message.receiver_id)) {
                uniqueMessages.push(message);
                seenReceiverIds.add(message.receiver_id);
            }
        }
        return uniqueMessages.map(m => m.receiver_id)
    }
   
    async getRooms(sender_id){
        const rooms = this.prismaService.room.findMany({
            where:{
                sender_id
            }
        })
        return rooms
    }
}
