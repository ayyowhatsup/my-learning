import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class MonthYearDto {
  @Min(1)
  @Max(12)
  @Type(() => Number)
  @IsInt()
  @ApiProperty()
  @IsOptional()
  month: number;

  @Type(() => Number)
  @IsInt()
  @Max(new Date().getFullYear())
  @ApiProperty()
  @IsOptional()
  year: number;
}
