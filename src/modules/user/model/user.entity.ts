import { Answer } from 'src/modules/answer/answer.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  login: string;

  @Column({ nullable: false })
  passwordHash?: string;

  @Column({ nullable: false })
  name: string;
  
  @Column({ nullable: false })
  roles: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(type => Answer, answer => answer.user)
  answers: Answer[];
}
