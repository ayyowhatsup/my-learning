import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Processor('mail')
export class MailConsumer {
  private readonly logger = new Logger(MailConsumer.name);
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('google.auth.client_id');
    const clientSecret = this.configService.get<string>(
      'google.auth.client_secret',
    );
    const refreshToken = this.configService.get<string>(
      'google.auth.refresh_token',
    );
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        type: 'oauth2',
        user: this.configService.get<string>('google.auth.user'),
        clientId,
        clientSecret,
        refreshToken,
      },
    });
    this.transporter.on('token', () => {
      this.logger.log('A new access token is generated!');
    });
  }
  @Process('sendMail')
  async handleSendMail(job: Job<any>) {
    const { to, subject, content } = job.data;
    await this.transporter.sendMail({
      from: `Neko Chan <${this.configService.get<string>('google.auth.user')}>`,
      to: to,
      subject: subject,
      text: content,
    });
  }
}
