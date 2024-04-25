import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger();
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { ip, method, originalUrl, body, params, query } = request;
    const userAgent = request.get('user-agent') || '';
    const resp = exception.getResponse();
    this.logger.error({
      ip,
      originalUrl,
      method,
      userAgent,
      user: request['user'] || {},
      body,
      params,
      query,
      response: resp,
    });
    const status = exception.getStatus();
    return response.status(status).json(resp);
  }
}
