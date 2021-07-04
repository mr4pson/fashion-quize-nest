import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { User } from '../user/model/user.entity';
import { StylistController } from './stylist.controller';
import { StylistService } from './stylist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [StylistController],
  providers: [
    StylistService,
    MailService,
  ],
})
export class StylistModule {}
