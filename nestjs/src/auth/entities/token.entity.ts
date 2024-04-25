import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import TOKEN_TYPE from '../enum/token-type.enum';

@Entity()
export class Token {
  @Column({ unique: true })
  token: string;

  @PrimaryColumn({
    type: 'enum',
    enum: [
      TOKEN_TYPE.REFRESH,
      TOKEN_TYPE.REGISTRATION,
      TOKEN_TYPE.RESET_PASSWORD,
    ],
  })
  type: TOKEN_TYPE;

  @Column({ type: 'timestamp' })
  expire: Date;

  @PrimaryColumn({ type: Number })
  userId: number;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn()
  user: User;
}
