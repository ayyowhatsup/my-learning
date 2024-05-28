import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private configService: ConfigService,
    @InjectQueue('mail') private readonly mailQueue: Queue,
  ) {}

  sendEmailResetPasswordLink(email: string, resetPasswordLink: string) {
    this.addMailJob(
      email,
      'Reset password',
      `Hello ${email},\n\nWe received your reset password request. Please click this link or paste it in your browser and continue\n${resetPasswordLink}\n\nThanks,\nNeko Chan.`,
    );
  }

  sendEmailPasswordChanged(email: string) {
    this.addMailJob(
      email,
      'Password changed',
      `Hello ${email},\n\nThis is a confirmation that the password for your account ${email} has been changed.\nIf you didn't change your password or having trouble, contact us.\n\nThanks,\nNeko Chan.`,
    );
  }

  addMailJob(to: string, subject: string, content: string) {
    this.mailQueue.add('sendMail', { to, subject, content });
  }
}
