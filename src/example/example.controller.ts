import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ExampleService } from './example.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExampleDto } from './dto/example.dto';
import { GetMeta } from 'src/util/meta';
import { CONTEXT_USER_ID, UserGuard } from 'src/user/user.guard';

@ApiBearerAuth()
@ApiTags('Example') // Swagger 标签
@Controller('example')
@UseGuards(UserGuard)
export class ExampleController {
  constructor(private readonly productService: ExampleService) {}
  @ApiOperation({ summary: '获取用户所有已激活的产品' })
  @ApiResponse({
    status: 200,
    description: '返回用户的激活产品列表',
    type: [ExampleDto],
  })
  @Get('user')
  getUserProducts(@GetMeta(CONTEXT_USER_ID) userId: number) {
    // 获取指定用户的已激活产品列表
    // return this.productService.getUserProducts(userId);
  }
}
