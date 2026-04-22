import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // o SMTP real
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendMail(options: {
    to: string;
    cc?: string[]; // 👈 agregar esto
    subject: string;
    text?: string;
    html?: string;
    attachments?: {
      filename: string;
      content: Buffer;
      contentType?: string;
    }[];
  }) {
    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      ...options,
    });
  }
}
