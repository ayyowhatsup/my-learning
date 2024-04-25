import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Token } from './entities/token.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([Token]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('auth.jwt_secret'),
      }),
      inject: [ConfigService],
    }),
    MailModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
