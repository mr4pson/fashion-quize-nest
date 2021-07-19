import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Compilation } from '../compilation/compilation.entity';
import { User } from '../user/model/user.entity';
import { TaskStatus } from './task-status.entity';
import { TaskType } from './task-type.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(type => TaskType, type => type)
  type: TaskType;

  @ManyToOne(type => TaskStatus, status => status)
  status: TaskStatus;

  @Column()
  comment: string;

  @ManyToOne(type => User, user => user)
  user: User;

  @ManyToOne(type => User, stilist => stilist)
  stylist: User;

  @OneToOne(() => Compilation, compilation => compilation.task)
  @JoinColumn()
  compilation?: Compilation;
}
