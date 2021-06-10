import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractAttachmentService } from './abstract-attachment.service';
import { AttachmentController } from './attachment.controller';
import { Attachment } from './attachment.entity';
import { MulterUtils } from './multer-utils.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
  ],
  controllers: [AttachmentController],
  providers: [AbstractAttachmentService, MulterUtils, Repository],
})
export class AttachmentModule {}
