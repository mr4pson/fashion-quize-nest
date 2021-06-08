import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Question } from '../question/question.entity';
@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  color: string;

  @OneToMany(type => Question, question => question.block)
  questions: Question[];
}
