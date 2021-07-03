import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/model/user.entity';
import { StylistController } from './stylist.controller';
import { StylistService } from './stylist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [StylistController],
  providers: [StylistService],
})
export class StylistModule {}
