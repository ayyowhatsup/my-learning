import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class ScheduleDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  timeExecute: Date;
  @ApiProperty()
  createdBy: User;
  @ApiProperty({ type: [User] })
  recipients: User[];
}
