import { Injectable } from '@nestjs/common';
import { SendGridService } from '@anchan828/nest-sendgrid';

@Injectable()
export class EmailService {
  constructor(private readonly sendGrid: SendGridService) {}

  async sendEmail(to: string, subject: string, text: string) {
    await this.sendGrid.send({
      to: to,
      from: process.env.EMAIL_HOST,
      subject: subject,
      text: text,
    });
  }
}
