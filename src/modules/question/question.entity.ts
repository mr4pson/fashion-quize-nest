import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Block } from '../block/block.entity';
import { QuestionType, QuizeTypes } from './types';
@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  type: QuestionType;

  @Column()
  options: string;

  @Column()
  quizeType: QuizeTypes;

  @ManyToOne(type => Block, block => block.questions)
  block: Block;
}
