import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ChangePasswordStatuses } from '../shared/enum/change-password-statuses.enum';
import { User } from '../user/model/user.entity';

@Entity()
export class ChangePasswordRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  status: ChangePasswordStatuses;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(type => User, user => user.changePasswordRequests)
  user: User;
}
