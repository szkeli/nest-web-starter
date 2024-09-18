import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
} from 'class-validator';

// 基于prisma 类的dto接口
export class ExampleDto implements Omit<User, 'id' | 'defaultUsage'> {
  username: string;
  password: string;
  @ApiProperty({
    description: '产品标题',
    example: 'Product Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '产品副标题',
    example: 'Product Subtitle',
  })
  @IsString()
  @IsOptional()
  subtitle: string;

  @ApiProperty({
    description: '产品主题',
    example: 'Product Subject',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: '产品 ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;
}
