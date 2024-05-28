import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import IResponse from './interfaces/response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const req = context.switchToHttp().getRequest();
        const { ip, method, originalUrl, body, params, query } = req;
        const userAgent = req.get('user-agent') || '';
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const resp: IResponse = {
          statusCode,
          message: 'The request was completed successfully!',
        };
        if (!!data && typeof data === 'object' && !Array.isArray(data)) {
          const { message, ...rest } = data;
          resp.message = message ?? resp.message;
          if (rest) resp.data = rest;
        } else if (!!data) {
          resp.data = data;
        }
        this.logger.log({
          ip,
          originalUrl,
          method,
          userAgent,
          user: req['user'] || {},
          body,
          params,
          query,
          response: resp,
        });
        return resp;
      }),
    );
  }
}
