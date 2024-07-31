import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as cryptography from '../lib/crypto'
import * as simpleParser from 'mailparser'
import * as Imap from 'node-imap'
import * as nodemailer from 'nodemailer'



@Injectable()
export class EmailsService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    public imapSettings
    public smtpSettings
    constructor(){
        super()
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
          }
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
          }
        }
        
    async onModuleInit(){
        await this.$connect()
    }
    async onModuleDestroy() {
        await this.$disconnect()
    }
    
    async fetchEmails(id:number) {
      const smtp = await this.sMTP.findFirst({
        where:{
            id:id
        }
      })
      const config = this.imapSettings[smtp.provider];

      if (!config) {
        console.error('IMAP settings not found for provider:', smtp.provider);
        return;
      }

      const imap = new Imap({
        user:smtp.email,
        password:cryptography.default.decrypt(smtp.password),
        host: config.host,
        port: config.port,
        tls: config.secure
      });

      function openInbox(cb) {
        imap.openBox('INBOX', false, cb);
      }

          function fetchEmails() {
            imap.connect();

            imap.once('ready', function () {
              openInbox(function (err) {
                if (err) throw err;

                const searchCriteria = ['ALL']; // Modify as needed
                const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'] };

                imap.search(searchCriteria, function (err, results) {
                  if (err) throw err;

                  const fetch = imap.fetch(results, fetchOptions);
                
                  fetch.on('message', function (msg, seqno) {
                    console.log('Message #%d', seqno);
                    const prefix = '(#' + seqno + ') ';

                    msg.on('body', function (stream,) {
                      simpleParser(stream, (err, parsed) => {
                        if (err) {
                          console.error('Error parsing email:', err);
                        } else {
                          console.log(`${prefix}From: ${parsed.from.text}`);
                          console.log(`${prefix}Subject: ${parsed.subject}`);
                          console.log(`${prefix}Date: ${parsed.date}`);
                          console.log(`${prefix}Text: ${parsed.text}`);
                        }
                      });
                    });

                    msg.once('attributes', function (attrs) {
                      console.log(`${prefix}Attributes: ${JSON.stringify(attrs)}`);
                    });

                    msg.once('end', function () {
                      console.log(`${prefix}Finished`);
                    });
                  });

                  fetch.once('end', function () {
                    console.log('Done fetching all messages!');
                    imap.end();
                  });
                });
              });
            });

            imap.once('error', function (err) {
              console.log('IMAP error:', err);
            });

            imap.once('end', function () {
              console.log('IMAP connection ended');
            });
          }

          return fetchEmails();
    }
    async sendMail(options){
        const { user_id,provider, to, subject, html } = options
        const smtps = await this.sMTP.findMany({
            where:{
                user_id:user_id
            }
        })

        const smtp = smtps.find((s)=>s.provider === provider)
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
              pass: cryptography.default.decrypt(smtp.password),
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
            const info = await transporter.sendMail(mailOptions);
            console.log();
            return `'Message sent: ${info.messageId}`
          } catch (error) {
            return `Error sending email: ${error}`
          }
    }
}
