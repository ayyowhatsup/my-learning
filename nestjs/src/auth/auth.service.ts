import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import TOKEN_TYPE from './enum/token-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { MoreThan, Repository } from 'typeorm';
import { AuthEmailRegisterDto } from './dto/auth-email-register.dto';
import { AuthChangePasswordDto } from './dto/auth-change-password.dto';
import { MailService } from 'src/mail/mail.service';
import { AuthTokenDto } from './dto/auth-token-dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthRequestPasswordDto } from './dto/auth-request-password.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';
import ms from 'ms';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async authenticate(emailLoginDto: AuthEmailLoginDto): Promise<User> {
    const { email, password } = emailLoginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await this.verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password!');
    }
    return user;
  }

  private generateToken(size = 64): string {
    return randomBytes(size).toString('base64url');
  }

  private generateJwt(
    payload: Record<string, number | string>,
    expire: string,
  ): string {
    return this.jwtService.sign(payload, { expiresIn: expire });
  }

  generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
    };
    return this.generateJwt(
      payload,
      this.configService.get<string>('auth.jwt_access_token_ttl'),
    );
  }

  async generateRefreshToken(user: User): Promise<string> {
    const rfToken = this.generateToken(75);
    const token = this.tokenRepository.create({
      token: rfToken,
      user,
      type: TOKEN_TYPE.REFRESH,
      expire: new Date(
        new Date().valueOf() +
          ms(this.configService.get<string>('auth.refresh_token_ttl')),
      ),
    });
    await this.tokenRepository.save(token);
    return rfToken;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt
      .genSalt(this.configService.get<number>('auth.password_hash_salt_factor'))
      .then((salt) => bcrypt.hash(password, salt));
  }

  private verifyPassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  private async generateRegisterToken(user: User): Promise<string> {
    const token = this.generateToken(24);
    const tokenDoc = this.tokenRepository.create({
      token,
      user,
      type: TOKEN_TYPE.REGISTRATION,
      expire: new Date(
        new Date().valueOf() +
          ms(this.configService.get<string>('auth.register_token_ttl')),
      ),
    });
    await this.tokenRepository.save(tokenDoc);
    return token;
  }

  private async generateResetPasswordToken(user: User) {
    const token = this.generateToken(24);
    const tokenDoc = this.tokenRepository.create({
      token,
      user,
      type: TOKEN_TYPE.RESET_PASSWORD,
      expire: new Date(
        new Date().valueOf() +
          ms(this.configService.get<string>('auth.reset_password_ttl')),
      ),
    });
    await this.tokenRepository.save(tokenDoc);
    return token;
  }

  async register(
    userData: Omit<AuthEmailRegisterDto, 'repeat_password'>,
  ): Promise<User> {
    const { email, password, ...rest } = userData;
    if (await this.usersService.isEmailTaken(email)) {
      throw new BadRequestException('Email is taken!');
    }
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      ...rest,
    });
    const token: string = await this.generateRegisterToken(user);
    await this.mailService.sendUserRegistrationEmailConfirmation({
      to: user.email,
      name: user.name,
      storefront_url: this.configService.get<string>('storefront_url'),
      confirmation_link: `${this.configService.get<string>('storefront_url')}/auth/registration-verify?token=${token}`,
    });
    return user;
  }

  getUserInfo(userId: number): Promise<User> {
    return this.usersService.findById(userId);
  }

  async changePassword(
    userId: number,
    authChangePasswordDto: AuthChangePasswordDto,
  ) {
    const { old_password, new_password } = authChangePasswordDto;
    const user = await this.usersService.findById(userId);
    if (!user || !(await this.verifyPassword(old_password, user.password))) {
      throw new UnauthorizedException('Password is not correct!');
    }
    const hashedPassword = await this.hashPassword(new_password);
    return this.usersService.updateUserPassword(userId, hashedPassword);
  }

  async confirmRegistration(authTokenDto: AuthTokenDto) {
    const { token } = authTokenDto;
    const tokenDoc = await this.tokenRepository.findOne({
      relations: ['user'],
      where: {
        token,
        type: TOKEN_TYPE.REGISTRATION,
        expire: MoreThan(new Date()),
      },
    });
    if (!tokenDoc) throw new BadRequestException('Invalid Token!');
    await this.tokenRepository.delete({ token });
    await this.usersService.update(tokenDoc.user.id, { is_verified: true });
  }

  async resetPassword(
    authTokenDto: AuthTokenDto,
    resetPasswordDto: AuthResetPasswordDto,
  ) {
    const { token } = authTokenDto;
    const tokenDoc: Token = await this.tokenRepository.findOne({
      relations: ['user'],
      where: {
        token,
        type: TOKEN_TYPE.RESET_PASSWORD,
        expire: MoreThan(new Date()),
      },
    });
    if (!tokenDoc) throw new BadRequestException('Invalid Token!');
    await this.tokenRepository.delete({ token });
    const { new_password } = resetPasswordDto;
    const hashedPassword = await this.hashPassword(new_password);
    await this.usersService.updateUserPassword(
      tokenDoc.user.id,
      hashedPassword,
    );
  }

  async requestToResetPassword(authRequestPasswordDto: AuthRequestPasswordDto) {
    const { email } = authRequestPasswordDto;
    const PASSWORD_MAX_REQUEST_DAY = 3;
    const requested: number =
      (await this.cacheManager.get(`password_reset_${email}`)) || 0;
    if (requested == PASSWORD_MAX_REQUEST_DAY)
      throw new HttpException(
        {
          message:
            'You have reached daily limit for requesting reset password. Try again later',
          statusCode: 429,
          error: 'Too Many Requests',
        },
        429,
      );
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59);
    this.cacheManager.set(
      `password_reset_${email}`,
      requested + 1,
      endOfDay.valueOf() - new Date().valueOf(),
    );
    const user = await this.usersService.findByEmail(email);
    if (!user) return;

    const token: string = await this.generateResetPasswordToken(user);
    await this.mailService.sendUserResetPassword({
      to: user.email,
      storefront_url: this.configService.get<string>('storefront_url'),
      confirmation_link: `${this.configService.get<string>('storefront_url')}/password/reset?token=${token}`,
    });
  }

  async refreshToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let tokenDoc: Token;
    console.log(token);
    if (
      !token ||
      !(tokenDoc = await this.tokenRepository.findOne({
        where: {
          token,
          type: TOKEN_TYPE.REFRESH,
          expire: MoreThan(new Date()),
        },
        relations: ['user'],
      }))
    ) {
      throw new UnauthorizedException('Invalid token!');
    }
    const newRfToken: string = await this.generateRefreshToken(tokenDoc.user);
    return {
      accessToken: this.generateAccessToken(tokenDoc.user),
      refreshToken: newRfToken,
    };
  }
}
