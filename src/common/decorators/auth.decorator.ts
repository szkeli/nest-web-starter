import { SetMetadata } from '@nestjs/common';
import { CONTEXT_USER, NO_AUTH_KEY } from '../constants/auth.constant';
import { GetMeta } from '../util/meta.util';

/**
 * 开放接口 - 被装饰的接口无需鉴权
 * @returns
 */
export const NoAuth = () => SetMetadata(NO_AUTH_KEY, true);

/**
 * 读取上下文用户元数据装饰器
 */
export const ContextUser = () => GetMeta(CONTEXT_USER);
