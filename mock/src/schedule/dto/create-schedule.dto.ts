import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  timeExecute: Date;

  @IsNumber({}, { each: true })
  @ApiProperty({ type: [Number] })
  recipientIds: number[];
}
