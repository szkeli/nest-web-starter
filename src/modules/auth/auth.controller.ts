import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginReqDto } from '../../common/dto/auth.dto';
import { NoAuth } from '../../common/decorators/auth.decorator';

@Controller('auth')
@ApiTags('鉴权')
@NoAuth()
export class AuthController {
  constructor(readonly authService: AuthService) {}

  /**
   * 登录
   * @param dto
   */
  async login(@Body() dto: LoginReqDto) {
    return this.authService.login(dto);
  }
}
