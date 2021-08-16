import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Compilation } from "./compilation.entity";
import { LookItem } from "./look-item.entity";

@Entity()
export class Look {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  selected: boolean;

  @ManyToOne(type => Compilation, compilation => compilation, { onDelete: "CASCADE" })
  compilation?: Compilation;

  @OneToMany(type => LookItem, lookItem => lookItem.look, { onDelete: "CASCADE", cascade: true })
  items: LookItem[];
}