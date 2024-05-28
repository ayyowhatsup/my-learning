import { ApiProperty } from '@nestjs/swagger';

export class TimeLogDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  checkInTime: string;

  @ApiProperty()
  checkOutTime: string;
}
