import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AuthEmailLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@example.com' })
  email: string;

  @ApiProperty({ example: 'p4@$$w0rd' })
  @IsNotEmpty()
  password: string;
}
