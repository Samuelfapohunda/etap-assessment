import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, Column, DeleteDateColumn } from 'typeorm';

export class AbstractEntity extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: string;
}