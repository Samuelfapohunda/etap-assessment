import { Entity, Column, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from "./base.entity";
import { Subject } from './subject.entity'; 
import { User } from './user.entity';

@Entity('topics')
export class Topic extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => Subject, subject => subject.topics, { nullable: false })
  subject: Subject;


  @Column()
  video: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToMany(() => User, User => User.completedTopics)
  @JoinTable() 
  completedBy: User[];
 
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;
}
 