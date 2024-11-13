import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * 分页排序、过滤参数校验器
 */
@ValidatorConstraint({ name: 'pageParam', async: false })
export class PageSortAndFilterValidator
  implements ValidatorConstraintInterface
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, _args: ValidationArguments) {
    // 如果验证通过，返回 true，否则返回 false
    if (!value) return true;
    if (value) {
      const parts = value.split(';');
      for (const part of parts) {
        const [label, order] = part.split(':');
        if (!label || !order) {
          return false;
        } else if (
          _args.property === 'sort' &&
          order !== 'asc' &&
          order !== 'desc'
        ) {
          return false;
        }
      }
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    // 返回验证失败时的错误消息
    return `Invalid ${args.targetName} format`;
  }
}
