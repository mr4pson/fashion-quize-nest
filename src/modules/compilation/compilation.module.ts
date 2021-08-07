import { CompilationService } from './compilation.service';
import { CompilationController } from './compilation.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compilation } from './compilation.entity';
import { Look } from './look.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compilation, Look]),
  ],
  controllers: [
    CompilationController,
  ],
  providers: [
    CompilationService,
    MailService,
  ],
})
export class CompilationModule { }
