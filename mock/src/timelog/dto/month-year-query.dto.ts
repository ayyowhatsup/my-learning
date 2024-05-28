import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class MonthYearDto {
  @Min(1)
  @Max(12)
  @Type(() => Number)
  @IsInt()
  @ApiProperty()
  month: number;

  @Type(() => Number)
  @IsInt()
  @Max(new Date().getFullYear())
  @ApiProperty()
  year: number;
}
