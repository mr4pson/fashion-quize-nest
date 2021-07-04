import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/model/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordConfirmation(user: User, token: string) {
    const url = `https://eyelish.ru/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.login,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Eyelish.ru. Восстановление пароля.',
      template: './reset-password', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }

  async resetPasswordSuccessfull(user: User, password: string) {
    await this.mailerService.sendMail({
      to: user.login,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Eyelish.ru. Успешное восстановление пароля.',
      template: './successfull-reset-password', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        password,
      },
    });
  }
}