import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as cryptography from '../lib/crypto'
import { PrismaClient } from '@prisma/client';
@Injectable()
export class SmtpService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    public smtpSettings
    public imapSettings
    constructor(){
        super()
        this.smtpSettings = {
            gmail:{ host: 'smtp.gmail.com',port: 587,secure: false },
            outlook: { host: 'smtp-mail.outlook.com', port: 587, secure: false },
            yahoo: { host: 'smtp.mail.yahoo.com', port: 587, secure: false },
            icloud: { host: 'smtp.mail.me.com', port: 587, secure: false },
            zoho: { host: 'smtp.zoho.com', port: 587, secure: false },
            yandex: { host: 'smtp.yandex.com', port: 587, secure: false },
            mail: { host: 'smtp.mail.com', port: 587, secure: false },
            gmx: { host: 'smtp.gmx.com', port: 587, secure: false },
            aol: { host: 'smtp.aol.com', port: 587, secure: false },
          }
        this.imapSettings = {
            gmail:{
                host: 'imap.gmail.com',
                port: 993,
                secure: true, 
            },
            outlook: {
              host: 'outlook.office365.com',
              port: 993,
              secure: true,
            },
            yahoo: {
              host: 'imap.mail.yahoo.com',
              port: 993,
              secure: true,
            },
            icloud: {
              host: 'imap.mail.me.com',
              port: 993,
              secure: true,
            },
            zoho: {
              host: 'imap.zoho.com',
              port: 993,
              secure: true,
            },
            yandex: {
              host: 'imap.yandex.com',
              port: 993,
              secure: true,
            },
            mail: {
              host: 'imap.mail.com',
              port: 993,
              secure: true,
            },
            gmx: {
              host: 'imap.gmx.com',
              port: 993,
              secure: true,
            },
            aol: {
              host: 'imap.aol.com',
              port: 993,
              secure: true,
            },
          }
        }
        async onModuleInit(){
            await this.$connect()
        }
        async onModuleDestroy() {
            await this.$disconnect()
        }
        async registerSMTP(email: string, password: string, provider: string, user_id: number) {
          // Encrypt the password
          const encrypt = cryptography.default.encrypt(password);
      
          // Check if user_id is a valid number
          if (typeof user_id === 'number') {
              // Prepare data for creation
              const smtp_creation = {
                  email: email,
                  password: encrypt.encryptedData,
                  provider: provider,
                  user_id: user_id,
                  vi:encrypt.iv,
                  is_active:false
              };
      
              // Create SMTP record
              try {
                  const SMTP = await this.sMTP.create({
                      data:smtp_creation
                  });
      
                  return SMTP;
              } catch (error) {
                  console.error('Error creating SMTP record:', error);
                  throw new Error('Could not create SMTP record');
              }
          } else {
              throw new Error('Invalid user_id');
          }
      }
        async getSMTPS(user_id:number){
            const providers = await this.sMTP.findMany({
                where:{
                    user_id:user_id
                }
            })
            return providers
        }
        async getSMTP(id:number){
            const smtp = await this.sMTP.findFirst({
                where:{
                    id:id
                }
            })
            return smtp
        }
        async deleteSMTP(id:number){
            const deleted = await this.sMTP.delete({
                where:{
                    id:id
                }
            })
            return deleted   
        }
        async updateSMTP(id,smtp){
            const updated = await this.sMTP.update({
                where:{
                    id:id
                },
                data:smtp
            })
            return updated
        }
    }

