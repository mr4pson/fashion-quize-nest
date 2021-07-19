import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnswerModule } from './modules/answer/answer.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlockModule } from './modules/block/block.module';
import { CompilationModule } from './modules/compilation/compilation.module';
import { MailModule } from './modules/mail/mail.module';
import { QuestionModule } from './modules/question/question.module';
import { StylistModule } from './modules/stylist/stylist.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    AuthModule,
    BlockModule,
    QuestionModule,
    AnswerModule,
    AttachmentModule,
    StylistModule,
    MailModule,
    TaskModule,
    CompilationModule,
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
