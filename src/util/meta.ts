import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description 使用`@GetMeta`装饰器在controller获取
 * @param metadataKey meta标识符
 * @param value 值
 * @param target 注入对象
 * @example setMeta(KEY, data, context.switchToHttp().getRequest<Request>())
 */
export const setMeta = (
  metadataKey: string,
  value: any,
  target: Request | object,
) => {
  Reflect.defineMetadata(metadataKey, value, target);
};

/**
 * @description meta的获取方法，需要setMeta相同的target对象
 * @param metadataKey meta标识符
 * @param target 获取的对象
 */
export function getMeta(metadataKey: string, target: Request | object) {
  return Reflect.getMetadata(metadataKey, target);
}

/**
 * @description controller装饰器获取上下文meta
 * @example function abc(@GetMeta(KEY) abc:string){}
 */
export const GetMeta = createParamDecorator(
  (metadataKey: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return Reflect.getMetadata(metadataKey, req);
  },
);
