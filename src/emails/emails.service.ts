import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as cryptography from '../lib/crypto';
import { simpleParser } from 'mailparser';
import * as imaps from 'imap-simple'
import * as nodemailer from 'nodemailer';
import * as _ from 'lodash'

@Injectable()
export class EmailsService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
  public imapSettings;
  public smtpSettings;

  constructor() {
    super();
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

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  fetchEmails = async(id:number) =>{

    const smtp = await this.sMTP.findFirst({
      where: { id: id },
    });
    const config = this.imapSettings[smtp.provider];
    const pass = cryptography.default.decrypt(smtp.password, smtp.vi);

    var imapConfig = {
      imap: {
          user:smtp.email,
          password:pass,
          host:config.host,
          port: config.port,
          tls: true,
          tlsOptions: { rejectUnauthorized:false },
        }
      };
      const emails = await imaps.connect(imapConfig)
              .then((connection:any) => {
                  return connection.openBox('INBOX')
                      .then(() => {
                          let searchCriteria = ['1:50'];
                          let fetchOptions = {
                          bodies: ['HEADER', 'TEXT', ''],
                      };
                      return connection.search(searchCriteria, fetchOptions)
                      .then(async(messages:any) => {
                          const emails:any = await Promise.all(messages.map(async(item:any) => {
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
  async sendMail(options) {
    const { user_id, provider, to, subject, html } = options;
    const smtps = await this.sMTP.findMany({
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
      const info = await transporter.sendMail(mailOptions);
      return `Message sent: ${info.messageId}`;
    } catch (error) {
      return `Error sending email: ${error}`;
    }
  }
}
