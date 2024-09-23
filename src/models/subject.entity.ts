import { Column, Entity, OneToMany, ManyToMany,  } from "typeorm";
import { AbstractEntity } from "./base.entity";
import { Topic } from './topic.entity'; 

@Entity('subjects')
export class Subject extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(() => Topic, topic => topic.subject)
  topics: Topic[]; 

  @Column()
  description: string;
}