import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import logger from './utils/logger';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './exception-filters/http.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('NestJS simple Auth')
    .setDescription('Simple Auth service on NestJS + JWT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'accessToken',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'refreshToken',
    )
    .setVersion('1.0')
    .addTag('Authentication')
    .addTag('Task')
    .build();
  const options = {
    customCss:
      '@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");*,html,body{font-family: "Poppins", sans-serif !important};',
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, options);
  await app.listen(3000);
}
bootstrap();
