import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthPairTokenResponse } from './dto/auth-pair-token-response.dto';
import { AuthUser } from './decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard, extractTokenFromHeader } from './auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseResponseDto } from 'src/shared/dto/base-response.dto';
import { AuthRequestPasswordDto } from './dto/auth-request-password.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthTokenDto } from './dto/auth-token-dto';
import { TokenService } from 'src/token/token.service';
import { Token } from 'src/token/entities/token.entity';
import { AuthChangePasswordDto } from './dto/auth-change-password.dto';

@ApiTags('Authentication')
@Controller('auth')
@ApiExtraModels(AuthPairTokenResponse)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiOperation({ summary: 'Log user into system' })
  @ApiBadRequestResponse({
    description: 'Invalid email or password!',
    schema: {
      $ref: getSchemaPath(BaseResponseDto),
    },
  })
  @ApiOkResponse({
    description: 'User login successfully!',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(AuthPairTokenResponse),
            },
          },
        },
      ],
    },
  })
  @Post('login')
  login(
    @Body() authEmailLoginDto: AuthEmailLoginDto,
  ): Promise<AuthPairTokenResponse> {
    return this.authService.login(authEmailLoginDto);
  }

  @ApiUnauthorizedResponse({
    description: 'Invalid token, authentication required',
    schema: {
      $ref: getSchemaPath(BaseResponseDto),
    },
  })
  @ApiOkResponse({
    description: 'Get user info successfully!',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(User),
            },
          },
        },
      ],
    },
  })
  @ApiOperation({ summary: 'Get current logged in user info' })
  @ApiBearerAuth('accessToken')
  @Get('me')
  @SerializeOptions({ strategy: 'exposeAll' })
  @UseGuards(AuthGuard)
  profile(@AuthUser() authUser): Promise<User> {
    return this.authService.profile(authUser.id);
  }

  @ApiOperation({
    summary: 'User change info',
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @Post('me')
  updateUserInfo(@AuthUser() user, @Body() updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  @ApiUnauthorizedResponse({
    description: 'Invalid token!',
    schema: {
      $ref: getSchemaPath(BaseResponseDto),
    },
  })
  @ApiOkResponse({
    description: 'Refresh token successfully!',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(AuthPairTokenResponse),
            },
          },
        },
      ],
    },
  })
  @ApiOperation({ summary: 'Refresh token' })
  @ApiBearerAuth('refreshToken')
  @Post('refresh')
  refreshToken(@Req() request) {
    const token = extractTokenFromHeader(request);
    return this.authService.refreshToken(token);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @ApiOperation({
    summary: 'User forget password',
  })
  async forgotPassword(@Body() authRequestPasswordDto: AuthRequestPasswordDto) {
    await this.authService.forgotPassword(authRequestPasswordDto.email);
    return {
      message:
        "We sent a password reset email to the address you provided. If it's correct, follow the link in the email to create a new password.",
    };
  }

  @ApiBadRequestResponse({
    description: 'Invalid token!',
    type: BaseResponseDto,
  })
  @ApiOkResponse()
  @ApiOperation({
    summary: 'User reset password',
  })
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(
    @Query() tokenDto: AuthTokenDto,
    @Body() dto: AuthResetPasswordDto,
  ) {
    const token: Token =
      await this.tokenService.findValidResetPasswordTokenWithRelation(
        tokenDto.token,
      );
    if (!token) {
      throw new BadRequestException('Invalid token!');
    }
    await this.authService.resetPassword(token.userId, dto.new_password);
  }

  @ApiOperation({
    summary: 'User change password',
  })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({
    type: BaseResponseDto,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    type: BaseResponseDto,
    description: 'Invalid old password!',
  })
  @ApiUnauthorizedResponse({
    type: BaseResponseDto,
    description: 'Invalid token!',
  })
  @ApiBody({
    type: AuthChangePasswordDto,
  })
  @HttpCode(200)
  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(@AuthUser() user, @Body() dto: AuthChangePasswordDto) {
    const { old_password, new_password } = dto;
    await this.authService.changePassword(user.id, old_password, new_password);
  }
}
