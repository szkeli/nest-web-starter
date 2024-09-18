import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Logger,
  Headers,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserGuard } from './user.guard';
import { GetUserRespDto, LoginDto, RegisterDto, Token } from './dto/user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  @Post('/login')
  @ApiOperation({
    summary: '登录',
    description:
      '登录成功后会返回一个 JWT token。对于需要鉴权的请求，客户端需要将 token 放在请求头的 <code>Authorization</code> 字段中，格式为 Bearer [token]。',
  })
  @ApiOkResponse({ description: 'JWT token', type: Token })
  login(@Body() loginDto: LoginDto) {
    this.logger.log(`login, ${JSON.stringify(loginDto)}`);
    return this.userService.login(loginDto);
  }

  @Post('/register')
  @ApiOperation({
    summary: '注册',
    description: '注册后直接返回token',
  })
  @ApiOkResponse({ description: 'JWT token', type: Token })
  register(@Body() register: RegisterDto) {
    this.logger.log(`login, ${JSON.stringify(RegisterDto)}`);
    return this.userService.register(register);
  }

  @Get()
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  @ApiOkResponse({ description: '获取用户信息', type: GetUserRespDto })
  getUser(@Headers('authorization') token?: string) {
    return this.userService.getUser(undefined, token);
  }
}
