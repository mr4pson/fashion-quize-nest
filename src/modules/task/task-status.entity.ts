import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TaskStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}