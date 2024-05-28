import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class TimeLog {
  @PrimaryColumn({ type: 'date' })
  date: string;

  @PrimaryColumn()
  userId: number;

  @Column({ type: 'time', nullable: true })
  checkInTime: Date;

  @Column({ type: 'time', nullable: true })
  checkOutTime: Date;

  @ManyToOne(() => User, (user) => user.timelogs)
  user: User;
}
