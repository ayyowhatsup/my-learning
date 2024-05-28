import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import GENDER from '../enums/gender.enum';
import { Token } from 'src/token/entities/token.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TimeLog } from 'src/timelog/entities/timelog.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'date' })
  dateOfBirth: Date;

  @ApiProperty()
  @Column({ type: 'enum', enum: GENDER })
  gender: GENDER;

  @ApiProperty()
  @Column()
  jobTitle: string;

  @ApiProperty()
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  @ApiProperty()
  isAdmin: boolean;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.createdUsers)
  @JoinColumn()
  createdBy: User;

  @OneToMany(() => User, (user) => user.createdBy)
  createdUsers: User[];

  @OneToMany(() => TimeLog, (timelog) => timelog.user)
  timelogs: TimeLog[];

  @OneToMany(() => Schedule, (schedule) => schedule.createdBy)
  createdSchedules: Schedule[];
}
