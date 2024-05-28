import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../decorators/match.decorator';

export class AuthResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'p4@$$w0rd1' })
  new_password: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'p4@$$w0rd1' })
  @Match('new_password')
  repeat_password: string;
}
