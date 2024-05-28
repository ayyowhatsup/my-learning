import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from './token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';
import { TimeLogModule } from './timelog/timelog.module';
import { ScheduleModule } from './schedule/schedule.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('auth.jwt_secret'),
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          autoLoadEntities: true,
          synchronize: true,
          ...configService.get<object>('database'),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TokenModule,
    MailModule,
    TimeLogModule,
    ScheduleModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: function (configService: ConfigService) {
        return {
          url: configService.get<string>('redis.url'),
        };
      },
    }),
  ],
  providers: [],
})
export class AppModule {}
