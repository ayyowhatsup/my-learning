import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsAfterNow } from '../decorators/is-after-now';

export class CreateScheduleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsDateString()
  @ApiProperty()
  @IsAfterNow()
  timeExecute: Date;

  @IsNumber({}, { each: true })
  @ApiProperty({ type: [Number] })
  recipientIds: number[];
}
