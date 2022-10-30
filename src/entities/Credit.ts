import {Entity, Column, PrimaryColumn, ManyToOne} from "typeorm";
import { Title } from "./Title";

@Entity()
export class Credit {
  @PrimaryColumn()
  personId: number;

  @ManyToOne(type => Title, title => title.id) title: Title
  id: number

  @Column()
  name: string;

  @Column()
  character: string;

  @Column()
  role: number;
}