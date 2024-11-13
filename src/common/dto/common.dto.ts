import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min, Validate } from 'class-validator';
import { PageSortAndFilterValidator } from '../validators/page.validator';

/**
 * 状态码枚举
 */
const ResultEnum = {
  SUCCESS: { code: 200, msg: '操作成功' },
  FAIL: { code: 500, msg: '操作失败' },
  VALIDATE_ERROR: { code: 400, msg: '参数验证失败' },
};

/**
 * 响应结果封装
 */
export class ResultDto<T> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '提示信息', example: '操作成功' })
  msg: string;

  @ApiProperty({ description: '业务数据' })
  data: T;

  constructor(code: number, msg: string, data: T) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  /**
   * 成功响应
   * @param data
   */
  static success<T>(data?: T): ResultDto<T> {
    return new ResultDto(ResultEnum.SUCCESS.code, ResultEnum.SUCCESS.msg, data);
  }

  /**
   * 失败响应
   * @param data
   */
  static fail<T>(data?: T): ResultDto<T> {
    return new ResultDto(ResultEnum.FAIL.code, ResultEnum.FAIL.msg, data);
  }

  /**
   * 自定义失败响应
   * @param code
   * @param msg
   */
  static failWithCodeAndMsg<T>(code: number, msg: string): ResultDto<T> {
    return new ResultDto(code, msg, null);
  }

  /**
   * 参数验证失败响应
   * @param msg
   */
  static paramValidateFail(msg: string): ResultDto<null> {
    return new ResultDto(ResultEnum.VALIDATE_ERROR.code, msg, null);
  }
}

/**
 * 通用请求参数dto
 */
export class QueryReqDto {
  @ApiProperty({ description: '搜索关键字', required: false })
  keyword?: string;
}

/**
 * 分页响应dto
 */
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

  @ApiProperty({
    description: '数据数组',
    type: () => [Object],
  })
  list: T[];

  constructor(init: {
    total: number;
    list: T[];
    page: number;
    pageSize: number;
  }) {
    const { page, pageSize, total, list } = init;
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
    this.list = list;
  }
}

/**
 * 分页请求参数dto
 */
export class PaginationReqDto extends QueryReqDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: '页码',
    example: 1,
    required: false,
  })
  @Min(1)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: '每页条数',
    example: 10,
    required: false,
  })
  @Min(1)
  @Max(500, {
    message: '最多请求500条数据',
  })
  pageSize?: number = 10;

  @Validate(PageSortAndFilterValidator)
  @IsOptional()
  @ApiProperty({
    description: '按 {label}:{data} 模糊搜索，;号为分隔',
    example: 'name:李四',
    nullable: true,
  })
  filter?: string;

  @Validate(PageSortAndFilterValidator)
  @IsOptional()
  @ApiProperty({
    description: '按 {label}:{asc}|{desc} 排序，;号为分隔',
    example: 'name:desc;createdAt:asc',
    nullable: true,
  })
  sort?: string;
}
