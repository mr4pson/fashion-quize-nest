import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  color: string;
}
