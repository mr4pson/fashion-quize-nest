import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Block } from '../block/block.entity';
import { QuestionDirectionAlignments, QuestionType, QuizeTypes } from './types';
@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  type: QuestionType;

  @Column()
  directionAlignment: QuestionDirectionAlignments;

  @Column("text")
  options: string;

  @Column()
  quizeType: QuizeTypes;

  @ManyToOne(type => Block, block => block.questions)
  block: Block;
}
