import { ApiProperty } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './auth-email-login.dto';
import { IsNotEmpty } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class AuthEmailRegisterDto extends AuthEmailLoginDto {
  @ApiProperty({ example: 'p4@$$w0rd' })
  @IsNotEmpty()
  @Match('password')
  repeat_password: string;

  @ApiProperty({ example: 'An' })
  @IsNotEmpty()
  name: string;
}
