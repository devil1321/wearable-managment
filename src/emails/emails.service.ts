import { Injectable } from '@nestjs/common';
import * as cryptography from '../lib/crypto';
import { simpleParser } from 'mailparser';
import * as imaps from 'imap-simple'
import * as nodemailer from 'nodemailer';
import * as _ from 'lodash'
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailsService   {
  public imapSettings;
  public smtpSettings;

  constructor(private prismaService:PrismaService) {
    this.smtpSettings = {
      gmail: { host: 'smtp.gmail.com', port: 587, secure: false },
      outlook: { host: 'smtp-mail.outlook.com', port: 587, secure: false },
      yahoo: { host: 'smtp.mail.yahoo.com', port: 587, secure: false },
      icloud: { host: 'smtp.mail.me.com', port: 587, secure: false },
      zoho: { host: 'smtp.zoho.com', port: 587, secure: false },
      yandex: { host: 'smtp.yandex.com', port: 587, secure: false },
      mail: { host: 'smtp.mail.com', port: 587, secure: false },
      gmx: { host: 'smtp.gmx.com', port: 587, secure: false },
      aol: { host: 'smtp.aol.com', port: 587, secure: false },
    };
    this.imapSettings = {
      gmail: {
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
    };
  }



  fetchEmails = async(id:number) =>{

    const smtp = await this.prismaService.sMTP.findFirst({
      where: { id: id },
    });
    if(smtp){

      const config = this.imapSettings[smtp.provider];
      const pass = cryptography.default.decrypt(smtp.password, smtp.vi);
      const imapConfig = {
        imap: {
          user:smtp.email,
          password:pass,
          host:config.host,
          port: config.port,
          tls: config.secure,
          tlsOptions: { rejectUnauthorized:false },
        }
      };
      const emails = await imaps.connect(imapConfig)
              .then((connection) => {
                  return connection.openBox('INBOX')
                      .then(() => {
                          let searchCriteria = ['1:50'];
                          let fetchOptions = {
                          bodies: ['HEADER', 'TEXT', ''],
                      };
                      return connection.search(searchCriteria, fetchOptions)
                      .then(async(messages) => {
                          const emails = await Promise.all(messages.map(async(item) => {
                          let all = _.find(item.parts, { "which": "" })
                          let id = item.attributes.uid;
                          let idHeader = "Imap-Id: "+id+"\r\n";
                          const mail = await simpleParser(idHeader+all.body)
                          return {
                              id:mail.messageId,
                              uid:id,
                              date:mail.date,
                              from:mail.from,
                              subject:mail.subject,
                              mail:mail.html,
                          }
                      }))
                          return emails
                      })
                  }) 
              })
              .then((emails:any) => emails)
              .catch((err:any) => console.log(err))
  
              return emails
              
            }
  }
  getUnseen = async(id) =>{

    const smtp = await this.prismaService.sMTP.findFirst({
      where: { id: id },
    });
    const config = this.imapSettings[smtp.provider];
    const pass = cryptography.default.decrypt(smtp.password, smtp.vi);

    const imapConfig = {
      imap: {
          user:smtp.email,
          password:pass,
          host:config.host,
          port: config.port,
          tls: true,
          tlsOptions: { rejectUnauthorized:false },
        }
      };

    const connection = await imaps.connect(imapConfig)
    const emails = await connection.openBox('INBOX')
                    .then(() => {
                            // Fetch emails from the last 24h
                        const delay = 24 * 3600 * 1000;
                        let yesterday:any = new Date();
                        yesterday.setTime(Date.now() - delay);
                        yesterday = yesterday.toISOString();
                        const searchCriteria = ['UNSEEN', ['SINCE', yesterday]];
                        let fetchOptions = {
                        bodies: ['HEADER', 'TEXT', ''],
                    };
                    return connection.search(searchCriteria, fetchOptions)
                    .then(async(messages) => {
                        const emails = await Promise.all(messages.map(async(item) => {
                        let all = _.find(item.parts, { "which": "" })
                        let id = item.attributes.uid;
                        let idHeader = "Imap-Id: "+id+"\r\n";
                        const mail = await simpleParser(idHeader+all.body)
                        return {
                            id:mail.messageId,
                            uid:id,
                            date:mail.date,
                            from:mail.from,
                            subject:mail.subject,
                            mail:mail.html,
                        }
                    }))
                        return emails
                    })
                }) 
                return emails
  }
  markEmailRead = async(id,uid) =>{

    const smtp = await this.prismaService.sMTP.findFirst({
      where: { id: id },
    });
    const config = this.imapSettings[smtp.provider];
    const pass = cryptography.default.decrypt(smtp.password, smtp.vi);

    const imapConfig = {
      imap: {
          user:smtp.email,
          password:pass,
          host:config.host,
          port: config.port,
          tls: true,
          tlsOptions: { rejectUnauthorized:false },
        }
      };

    imaps.connect(imapConfig)
    .then((connection) => {
            connection.openBox('INBOX')
                .then(() => {
                    let searchCriteria = ['ALL'];
                    let fetchOptions = {
                    bodies: ['HEADER', 'TEXT', ''],
                };
                connection.search(searchCriteria, fetchOptions)
                .then(async(messages:any) => {
                    const emails:any = await Promise.all(messages.map(async(item:any) => item))
                    const email = emails.find((e:any) => e.attributes.uid === uid)
                    connection.addFlags(email.attributes.uid, "\Seen", (err:any) => {
                        if (err){
                            console.log(err); 
                        }
                       return 'Email Seen'
                    })
                })
            }) 
        })
        .catch((err:any) => console.log(err))
  }
  removeEmail = async(id,uid)=>{
    const smtp = await this.prismaService.sMTP.findFirst({
      where: { id: id },
    });
    const config = this.imapSettings[smtp.provider];
    const pass = cryptography.default.decrypt(smtp.password, smtp.vi);

    const imapConfig = {
      imap: {
          user:smtp.email,
          password:pass,
          host:config.host,
          port: config.port,
          tls: true,
          tlsOptions: { rejectUnauthorized:false },
        }
      };
      try{
    const connection = await imaps.connect(imapConfig)
            connection.openBox('INBOX')
                .then(() => {
                    let searchCriteria = ['ALL'];
                    let fetchOptions = {
                    bodies: ['HEADER', 'TEXT', ''],
                };
                connection.search(searchCriteria, fetchOptions)
                .then(async(messages) => {
                    const emails = await Promise.all(messages.map(async(item) => item))
                    const email = emails.find((e) => e.attributes.uid === uid)
                    connection.addFlags(email.attributes.uid, "\Deleted", (err) => {
                        if (err){
                            console.log(err); 
                        }
                       return 'Email Deleted'
                    })
                })
            }) 
        
      }catch(err){
        console.log(err)
      }
  }
  async sendMail(options) {
    const { user_id, provider, to, subject, html } = options;
    const smtps = await this.prismaService.sMTP.findMany({
      where: {
        user_id: user_id,
      },
    });

    const smtp = smtps.find((s) => s.provider === provider);
    const smtpConfig = this.smtpSettings[smtp.provider];

    if (!smtpConfig) {
      return { error: 'Invalid email provider' };
    }
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465,
      auth: {
        user: smtp.email,
        pass: cryptography.default.decrypt(smtp.password, smtp.vi),
      },
    });
    const mailOptions = {
      from: `"${smtp.email}" <${smtp.email}>`,
      to: to,
      subject: subject,
      text: '',
      html: html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true
    } catch (error) {
      return false
    }
  }
}
