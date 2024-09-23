import { Column, Entity, OneToMany, ManyToMany,  } from "typeorm";
import { AbstractEntity } from "./base.entity";
import { ROLE } from "../common/enums";
import { Topic } from "./topic.entity";

@Entity('users')
export class User extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({enum: ROLE, type: 'enum'})
  role: string;
  
  @Column({ nullable: true })
  refreshokenHash: string;

  @ManyToMany(() => Topic, topic => topic.completedBy)
  completedTopics: Topic[];

  @Column({nullable: true})
  completionRate: number;
}