import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginReqDto, LoginUserInfo } from '../../common/dto/auth.dto';
import { RedisService } from '../redis/redis.service';
import {
  LOGIN_INFO_PREFIX,
  REQUEST_TOKEN_PREFIX,
} from '../../common/constants/auth.constant';
import {
  InvalidPasswordException,
  LoginStatusException,
} from '../../common/exceptions/auth.exception';
import CryptoJS from 'crypto-js';

interface JwtTokenPayload {
  user: { id: number };
}

@Injectable()
export class AuthService {
  constructor(
    readonly prismaService: PrismaService,
    readonly jwtService: JwtService,
    readonly redisService: RedisService,
  ) {}

  /**
   * 校验token并获取用户信息
   * @param token
   */
  async getUserInfoByToken(token: string): Promise<LoginUserInfo> {
    let loginUserInfo: LoginUserInfo = null;
    try {
      // 校验JWT
      const payload = this.jwtService.verify<JwtTokenPayload>(token);

      // 查询用户信息
      loginUserInfo = await this.redisService.get<LoginUserInfo>(
        LOGIN_INFO_PREFIX + payload?.user?.id,
      );
    } catch {
      throw new LoginStatusException();
    }

    return loginUserInfo;
  }

  /**
   * 登录
   * @param dto
   */
  async login(dto: LoginReqDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (!user) {
      throw new InvalidPasswordException();
    }

    // 解密
    const originalPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY,
    ).toString(CryptoJS.enc.Utf8);

    if (!user || originalPassword !== dto.password) {
      throw new InvalidPasswordException();
    }
    delete user.password;
    return {
      token: await this.signToken({
        id: user.id,
        /* ... */
      }),
    };
  }

  /**
   * 生成token
   * @param user
   */
  async signToken(user) {
    return `${REQUEST_TOKEN_PREFIX} ${this.jwtService.sign(
      {
        user,
      },
      {
        expiresIn: '7d',
      },
    )}`;
  }
}
