import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import JwtTokenPayload from './types/token-payload.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid token!');
    }
    try {
      const payload: JwtTokenPayload = this.jwtService.verify(token);
      request['user'] = { id: payload.sub, token };
    } catch {
      throw new UnauthorizedException('Invalid token!');
    }
    return true;
  }
}

export function extractTokenFromHeader(request: any): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
