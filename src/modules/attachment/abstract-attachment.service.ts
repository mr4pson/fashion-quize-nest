import { Injectable, Scope } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Attachment } from './attachment.entity';


@Injectable({ scope: Scope.REQUEST })
export class AbstractAttachmentService {
  attachmentRepository: Repository<Attachment>;
  constructor(
    private connection: Connection,
  ) {
    this.attachmentRepository = this.connection.getRepository(Attachment);
  }

  /**
   * Add attachment
   *
   * @param {any[]} files
   * @param {string} userId
   * @returns {Promise<IAttachment[]>}
   * @memberof AbstractAttachmentService
   */
  async addAttachments(files: any[], userId: string): Promise<Attachment[]> {
    const attachments: Attachment[] = [];

    for (const file of files) {
      // Get the file properties
      const { filename, originalname, mimetype, size } = file;

      // Form the attachment object
      const attachment = new Attachment(
        filename,
        originalname,
        mimetype,
        size,
        true,
      );

      // Collect all attachments
      attachments.push(attachment);
    }

    // Persist the data
    return await this.attachmentRepository.save(attachments);
  }
}
