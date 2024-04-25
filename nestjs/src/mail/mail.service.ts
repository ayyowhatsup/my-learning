import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';
import { UserRegistrationTemplateData } from './dto/user-registration-template-data.dto';
import UserResetPasswordTemplateData from './dto/user-reset-password-template-data.dto';
@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('mail.sendgrid_api_key'));
  }

  send(
    data: SendGrid.MailDataRequired,
  ): Promise<[SendGrid.ClientResponse, object]> {
    return SendGrid.send(data);
  }

  sendUserRegistrationEmailConfirmation(data: UserRegistrationTemplateData) {
    const { to, ...rest } = data;
    const content: SendGrid.MailDataRequired = {
      to: to,
      from: this.configService.get<string>('mail.sendgrid_send_from'),
      subject: 'Registration Confirmation',
      templateId: this.configService.get<string>(
        'mail.sendgrid_user_registration_template_id',
      ),
      dynamicTemplateData: rest,
    };
    return this.send(content);
  }

  sendUserResetPassword(data: UserResetPasswordTemplateData) {
    const { to, ...rest } = data;
    const content: SendGrid.MailDataRequired = {
      to: to,
      from: this.configService.get<string>('mail.sendgrid_send_from'),
      templateId: this.configService.get<string>(
        'mail.sendgrid_user_reset_password_template_id',
      ),
      dynamicTemplateData: rest,
    };
    return this.send(content);
  }
}
