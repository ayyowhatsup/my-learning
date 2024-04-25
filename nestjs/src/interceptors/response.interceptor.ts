import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

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
        const { message, ...rest } = data ?? {};
        const resp = {
          statusCode,
          message: message || 'The request was completed successfully!',
          data: rest || null,
        };
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
