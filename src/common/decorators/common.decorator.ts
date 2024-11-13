import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationRespDto, ResultDto } from '../dto/common.dto';

class ApiResultOptions {
  /**
   * 实体类型
   */
  type: Type;

  /**
   * 是否是数组 - 仅非分页时生效
   */
  isArray?: boolean;
  /**
   * 是否分页
   */
  isPaginated?: boolean;
}

/**
 * swagger 封装响应结果 装饰器
 * @param options
 * @constructor
 */
export function ApiResult(options?: ApiResultOptions) {
  // 空数据响应
  if (!options) {
    return applyDecorators(
      ApiExtraModels(ResultDto),
      ApiOkResponse({
        schema: {
          allOf: [{ $ref: getSchemaPath(ResultDto) }],
        },
      }),
    );
  }

  // 兼容原始类型
  const isPrimitiveType =
    options.type === String ||
    options.type === Number ||
    options.type === Boolean;
  const dataSchema = options.isPaginated
    ? {
        properties: {
          data: {
            allOf: [
              { $ref: getSchemaPath(PaginationRespDto) },
              {
                properties: {
                  list: {
                    type: 'array',
                    items: isPrimitiveType
                      ? { type: options.type.name.toLowerCase() }
                      : { $ref: getSchemaPath(options.type) },
                  },
                },
              },
            ],
          },
        },
      }
    : {
        properties: {
          data: {
            ...(options.isArray
              ? {
                  type: 'array',
                  items: isPrimitiveType
                    ? { type: options.type.name.toLowerCase() }
                    : { $ref: getSchemaPath(options.type) },
                }
              : isPrimitiveType
                ? { type: options.type.name.toLowerCase() }
                : { $ref: getSchemaPath(options.type) }),
          },
        },
      };

  return applyDecorators(
    ApiExtraModels(ResultDto, PaginationRespDto, options.type),
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(ResultDto) }, dataSchema],
      },
    }),
  );
}
