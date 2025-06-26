import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    // if (info?.name === 'TokenExpiredError') {
    //   throw new UnauthorizedException(
    //     'Token đã hết hạn. Vui lòng đăng nhập lại.',
    //   );
    // }

    if (err || !user) {
      throw err || new UnauthorizedException('Access token không hợp lệ');
    }
    return user;
  }
}
