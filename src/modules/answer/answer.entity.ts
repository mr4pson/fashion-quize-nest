import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/model/user.entity';
@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;

  @ManyToOne(type => User, user => user)
  user: User;
}
