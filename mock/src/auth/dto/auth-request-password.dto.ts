import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthRequestPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@example.com' })
  email: string;
}
