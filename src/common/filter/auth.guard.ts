import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { setMeta, getMeta } from 'src/common/util/meta.util';
import { AuthService } from 'src/modules/auth/auth.service';
import {
  CONTEXT_USER,
  NO_AUTH_KEY,
  REQUEST_TOKEN_PREFIX,
} from '../constants/auth.constant';
import { LoginStatusException } from '../exceptions/auth.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (true) {
      return true;
    }

    // 判断是否需要鉴权
    if (getMeta(NO_AUTH_KEY, context.getHandler())) return true;

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new LoginStatusException();
    }

    // 校验token
    const loginUserInfo = await this.authService.getUserInfoByToken(token);

    // 设置上下文用户信息
    setMeta(CONTEXT_USER, loginUserInfo, request);

    return true;
  }

  /**
   * 从请求头提取token
   * @param request
   * @private
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    // @ts-expect-error 忽略 authorization 的无类型问题
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === REQUEST_TOKEN_PREFIX ? token : undefined;
  }
}
