import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        pool: true,
        host: 'mail.eyelish.ru',
        secure: false,
        tls: {
          rejectUnauthorized: false
        },
        secureConnection: false,
        port: 587,
        auth: {
          user: 'user1',
          pass: 'salesman',
        },
      },
      defaults: {
        from: 'noreply@eyelish.ru',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}