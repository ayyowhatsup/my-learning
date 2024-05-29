import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthPairTokenResponse } from './dto/auth-pair-token-response.dto';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/users/entities/user.entity';
import { Token } from 'src/token/entities/token.entity';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: AuthEmailLoginDto): Promise<AuthPairTokenResponse> {
    const user = await this.usersService.findByEmailAndPassword(
      loginDto.email,
      loginDto.password,
    );

    if (!user) throw new BadRequestException('Invalid email or password!');
    return {
      accessToken: this.tokenService.generateAccessToken(user),
      refreshToken: await this.tokenService.generateRefreshToken(user),
    };
  }

  async profile(userId: number): Promise<User> {
    return this.usersService.findById(userId);
  }

  async refreshToken(token: string): Promise<AuthPairTokenResponse> {
    let tokenDoc: Token;
    if (
      !token ||
      !(tokenDoc =
        await this.tokenService.findValidRefreshTokenByTokenWithRelation(token))
    ) {
      throw new UnauthorizedException('Invalid token!');
    }
    const newRfToken: string = await this.tokenService.generateRefreshToken(
      tokenDoc.user,
    );
    return {
      accessToken: this.tokenService.generateAccessToken(tokenDoc.user),
      refreshToken: newRfToken,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return;

    const token: string =
      await this.tokenService.generateResetPasswordToken(user);

    const resetPasswordLink = `${this.configService.get<string>(
      'storefront_reset_password_url',
    )}?token=${token}`;

    this.mailService.sendEmailResetPasswordLink(email, resetPasswordLink);
  }

  async resetPassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.usersService.updatePassword(userId, newPassword);
    this.mailService.sendEmailPasswordChanged(user.email);
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const isMatch = await this.usersService.verifyUserPassword(
      userId,
      oldPassword,
    );
    if (!isMatch) {
      throw new BadRequestException('Old password is not correct!');
    }
    return this.resetPassword(userId, newPassword);
  }
}
