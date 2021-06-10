import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  originalFileName: string;

  @Column()
  mediaType: string;

  @Column()
  fileSize: number;

  @Column()
  isCommentAttachment: boolean;

  @Column()
  parent: string;

  constructor(
    fileName: string,
    originalFileName: string,
    mediaType: string,
    fileSize: number,
    isCommentAttachment: boolean,
    parent?: string,
  ) {
    this.fileName = fileName;
    this.originalFileName = originalFileName;
    this.mediaType = mediaType;
    this.fileSize = fileSize;
    this.parent = parent;
    this.isCommentAttachment = isCommentAttachment;
  }
}
