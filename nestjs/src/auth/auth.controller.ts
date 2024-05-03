import {
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
import { AuthEmailRegisterDto } from './dto/auth-email-register.dto';
import { User } from 'src/users/entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { AuthGuard, extractTokenFromHeader } from './auth.guard';
import { AuthChangePasswordDto } from './dto/auth-change-password.dto';
import { AuthTokenDto } from './dto/auth-token-dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthRequestPasswordDto } from './dto/auth-request-password.dto';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async login(
    @Body() authEmailLoginDto: AuthEmailLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authService.authenticate(authEmailLoginDto);
    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'User register' })
  @ApiBadRequestResponse()
  @ApiCreatedResponse()
  async register(
    @Body() authEmailRegisterDto: AuthEmailRegisterDto,
  ): Promise<User> {
    return this.authService.register(authEmailRegisterDto);
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Get user info' })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('me')
  @SerializeOptions({ strategy: 'exposeAll' })
  async userInfo(@Req() request: any) {
    return await this.authService.getUserInfo(request.user.id);
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Change user password' })
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('change-password')
  async changePassword(
    @Req() request,
    @Body() authChangePasswordDto: AuthChangePasswordDto,
  ) {
    await this.authService.changePassword(
      request.user.id,
      authChangePasswordDto,
    );
  }

  @Post('confirm-registration')
  @ApiOperation({ summary: 'User registration confirmation' })
  @ApiNoContentResponse()
  @HttpCode(204)
  confirmRegistration(@Query() authTokenDto: AuthTokenDto) {
    return this.authService.confirmRegistration(authTokenDto);
  }

  @Post('password/reset')
  @ApiOperation({ summary: 'User set a new password' })
  @ApiOkResponse()
  @HttpCode(200)
  resetPassword(
    @Query() authTokenDto: AuthTokenDto,
    @Body() authResetPasswordDto: AuthResetPasswordDto,
  ) {
    return this.authService.resetPassword(authTokenDto, authResetPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'User forget password, request to reset' })
  @ApiTooManyRequestsResponse()
  @ApiOkResponse()
  async requestToResetPassword(
    @Body() authRequestPasswordDto: AuthRequestPasswordDto,
  ) {
    await this.authService.requestToResetPassword(authRequestPasswordDto);
    return {
      message:
        "We sent a password reset email to the address you provided. If it's correct, follow the link in the email to create a new password.",
    };
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiBearerAuth('refreshToken')
  refreshToken(@Req() req: Request) {
    const refreshToken = extractTokenFromHeader(req);
    return this.authService.refreshToken(refreshToken);
  }
}
