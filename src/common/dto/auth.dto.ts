import { ApiProperty } from '@nestjs/swagger';

/**
 * 登录用户信息（上下文用户数据类型）
 */
export class LoginUserInfo {
  @ApiProperty({ description: '用户id' })
  id: number;
  @ApiProperty({ description: '用户名' })
  username: string;
  /* ...其余用户信息 */
}

/**
 * 登录请求dto
 */
export class LoginReqDto {
  @ApiProperty({ description: '账号' })
  username: string;
  @ApiProperty({ description: '密码' })
  password: string;
}

/**
 * 登录成功响应对象
 */
export class LoginRespDto {
  @ApiProperty({ description: 'token' })
  token: string;
}
