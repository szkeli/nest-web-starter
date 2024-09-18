import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
export class Token {
  @ApiProperty({ description: 'JWT token' })
  token: string;
}

export class RegisterDto {
  @ApiProperty({ description: '账号' })
  username: string;
  @ApiProperty({ description: '密码' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ description: '账号' })
  username: string;
  @ApiProperty({ description: '密码' })
  password: string;
}

export class GetUserRespDto implements Omit<User, 'password'> {
  @ApiProperty({ description: '用户id' })
  id: number;
  @ApiProperty({ description: '账号' })
  username: string;
}
