import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'paginationParam', async: false })
export class CustomValidator implements ValidatorConstraintInterface {
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

export class PaginationRespDto<T> {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '页码', example: 1 })
  page: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '每页条数', example: 10 })
  pageSize: number;

  @IsNumber()
  @ApiProperty({ description: '总数', example: 50 })
  total: number;

  data: T[];

  constructor(init: {
    total: number;
    data: T[];
    page: number;
    pageSize: number;
  }) {
    const { page, pageSize, total, data } = init;
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
    this.data = data;
  }
}

export class PaginationReqDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  page?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ description: '每页条数', example: 10, nullable: true })
  pageSize?: number;

  @Validate(CustomValidator)
  @IsOptional()
  @ApiProperty({
    description: '按 {label}:{data} 模糊搜索，;号为分隔',
    example: 'name:李四',
    nullable: true,
  })
  filter?: string;

  @Validate(CustomValidator)
  @IsOptional()
  @ApiProperty({
    description: '按 {label}:{asc}|{desc} 排序，;号为分隔',
    example: 'name:desc;createdAt:asc',
    nullable: true,
  })
  sort?: string;
}

export const convertTagStr2TagObj = (str?: string) => {
  if (!str) return {};
  const parts = str.split(';');
  const data: Record<string, string> = {};
  for (const part of parts) {
    const [label, order] = part.split(':');
    data[label] = order;
  }
  return data;
};
