import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ServerResponse } from 'http';
import { setMeta } from 'src/util/meta';
export const CONTEXT_USER_ID = 'context_user_id';
@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('未登录 Unauthorized');
    }

    const result = await this.userService.validateToken(token);

    if (result.refreshToken) {
      const res = context.switchToHttp().getResponse<ServerResponse>();
      res.setHeader('refresh-token', result.refreshToken);
    }

    setMeta(CONTEXT_USER_ID, result.userId, request);

    return result.valid;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // @ts-expect-error 忽略 authorization 的无类型问题
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
