import { ApiProperty } from '@nestjs/swagger';

export class AuthPairTokenResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
