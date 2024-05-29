import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  sendEmailRegisterConfirmation(email: string, updatePasswordLink: string) {
    this.addMailJob(
      email,
      'Account was created for you',
      `Hello ${email},\n\nThe Administrator created an account for you. Now you are a member our application. Click this link to set an password\n${updatePasswordLink}\n\nThanks,\nNeko Chan.`,
    );
  }

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

  sendMailNotification(to: string, subject: string, content: string) {
    this.addMailJob(
      to,
      `[Neko Chan Notification]: ${subject}`,
      `You have a new notification\n\n--------------------\n${content}\n--------------------\n\nSend with love,\nNeko Chan`,
    );
  }
}
