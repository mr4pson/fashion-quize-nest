import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../task/task.entity";
import { Look } from "./look.entity";

@Entity()
export class Compilation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Task, task => task.compilation) // specify inverse side as a second parameter
  task: Task;

  @OneToMany(type => Look, look => look.compilation, { onDelete: "CASCADE", cascade: true })
  looks: Look[];
}