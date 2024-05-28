import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthResetPasswordDto } from './auth-reset-password.dto';

export class AuthChangePasswordDto extends AuthResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'p4@$$w0rd' })
  old_password: string;
}
