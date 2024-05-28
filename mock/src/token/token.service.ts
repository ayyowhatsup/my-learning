import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import TOKEN_TYPE from './enums/token-type.enum';
import ms from 'ms';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  private generateOpaqueToken(size = 64): string {
    return randomBytes(size).toString('base64url');
  }

  private generateJwt(
    payload: Record<string, number | string | boolean>,
    expire: string,
  ): string {
    return this.jwtService.sign(payload, { expiresIn: expire });
  }

  verifyJwt(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Invalid token!');
    }
  }
  generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      isAdmin: user.isAdmin,
    };
    return this.generateJwt(
      payload,
      this.configService.get<string>('auth.jwt_access_token_ttl'),
    );
  }

  async generateRefreshToken(user: User): Promise<string> {
    const rfToken = this.generateOpaqueToken(75);
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

  async generateResetPasswordToken(user: User) {
    const token = this.generateOpaqueToken(24);
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

  findValidRefreshTokenByTokenWithRelation(token: string) {
    return this.tokenRepository.findOne({
      where: {
        token: token,
        type: TOKEN_TYPE.REFRESH,
        expire: MoreThan(new Date()),
      },
      relations: ['user'],
    });
  }

  findValidResetPasswordTokenWithRelation(token: string) {
    return this.tokenRepository.findOne({
      where: {
        token: token,
        type: TOKEN_TYPE.RESET_PASSWORD,
        expire: MoreThan(new Date()),
      },
      relations: ['user'],
    });
  }
}
