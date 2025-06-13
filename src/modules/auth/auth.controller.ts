import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginReqDto, LoginRespDto } from '../../common/dto/auth.dto';
import { NoAuth } from '../../common/decorators/auth.decorator';
import { ApiResult } from '../../common/decorators/common.decorator';

@Controller('auth')
@ApiTags('鉴权')
@NoAuth()
export class AuthController {
  constructor(readonly authService: AuthService) {}

  /**
   * 登录
   * @param dto
   */
  @ApiResult({ type: LoginRespDto })
  @ApiOperation({ summary: '登录' })
  @Post('/login')
  async login(@Body() dto: LoginReqDto) {
    return this.authService.login(dto);
  }
}
