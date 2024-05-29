import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import GENDER from '../enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsDateString()
  @ApiProperty({ example: 'YYYY-MM-DD' })
  dateOfBirth: string;

  @ApiProperty({ enum: GENDER })
  @IsNotEmpty()
  @IsEnum(GENDER)
  gender: GENDER;

  @ApiProperty({ example: 'Senior Intern' })
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({ example: 'example@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  isAdmin: boolean = false;

  @IsOptional()
  @ApiProperty()
  password: string;
}
