import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatuses } from '../shared/enum/task-statuses.enum';
import { TaskTypes } from '../shared/enum/task-types.enum';
import { User } from '../user/model/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  type: TaskTypes;

  @Column()
  status: TaskStatuses;

  @Column()
  comment: string;

  @ManyToOne(type => User, user => user)
  user: User;

  @ManyToOne(type => User, stilist => stilist)
  stylist: User;
}
