import { Exclude } from 'class-transformer';
import { Token } from 'src/auth/entities/token.entity';
import { Task } from 'src/task/entities/task.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Task, (task) => task.assigner)
  tasks: Task[];

  @ManyToMany(() => Task, (task) => task.assignees)
  assigned_tasks: Task[];
}
