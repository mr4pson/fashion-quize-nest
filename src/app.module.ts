import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BlockModule } from './modules/block/block.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswerModule } from './modules/answer/answer.module';
import { AttachmentModule } from './modules/attachment/attachment.module';

@Module({
  imports: [
    AuthModule,
    BlockModule,
    QuestionModule,
    AnswerModule,
    AttachmentModule,
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
