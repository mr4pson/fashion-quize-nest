import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Look } from "./look.entity";

@Entity()
export class LookItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  photo: string;

  @ManyToOne(type => Look, look => look, { onDelete: "CASCADE" })
  look?: Look;
}