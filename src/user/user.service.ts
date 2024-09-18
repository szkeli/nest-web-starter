import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as CryptoJS from 'crypto-js';
import { User } from '@prisma/client';
import { LoginDto, RegisterDto, Token } from './dto/user.dto';
import {
  InvalidPasswordException,
  UserExistedException,
  UserNotFoundException,
} from 'src/exception/user';

interface JwtTokenPayload {
  u: User; // userId
  // v: number; // version
}
@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateToken(
    token: string,
  ): Promise<{ valid: boolean; userId?: number; refreshToken?: string }> {
    try {
      const payload = this.jwtService.verify<JwtTokenPayload>(token);

      const user = await this.getUser(payload.u.id);

      // if (!user || payload.v !== user.version) {
      //   return { valid: false };
      // }
      if (!user) return { valid: false };
      return {
        valid: true,
        userId: user.id,
        refreshToken: await this.signToken(user),
      };
    } catch (e: any) {
      console.error(
        `Validate token failed, err: ${e.message}, token: ${token}`,
      );
      return { valid: false };
    }
  }

  async login(loginDto: LoginDto): Promise<Token> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: loginDto.username,
      },
    });
    console.log(user.password, process.env.PASSWORD_SECRET_KEY);

    if (!user) {
      throw new InvalidPasswordException();
    }
    const originalPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY,
    ).toString(CryptoJS.enc.Utf8);

    if (!user || originalPassword !== loginDto.password) {
      throw new InvalidPasswordException();
    }
    delete user.password;
    return {
      token: await this.signToken(user),
    };
  }

  async register(register: RegisterDto): Promise<Token> {
    const user = await this.prisma.user.count({
      where: {
        username: register.username,
      },
    });

    if (user) {
      throw new UserExistedException();
    }

    const encryptPwd = CryptoJS.AES.encrypt(
      register.password,
      process.env.PASSWORD_SECRET_KEY,
    ).toString();

    const newUser = await this.prisma.user.create({
      data: {
        username: register.username,
        password: encryptPwd,
      },
    });

    return {
      token: await this.signToken(newUser),
    };
  }

  async signToken(user: Omit<User, 'password'>) {
    return `Bearer ${this.jwtService.sign(
      {
        u: user,
        // v: user.version,
      },
      {
        secret: process.env.JWT_SIGN,
        expiresIn: '7d',
      },
    )}`;
  }

  async getUser(
    userId?: number,
    token?: string,
  ): Promise<Omit<User, 'password'> | null> {
    if (!userId && !token) throw new UserNotFoundException();
    if (token) {
      const user: JwtTokenPayload = this.jwtService.verify(
        token.replace('Bearer ', ''),
        {
          secret: process.env.JWT_SIGN,
        },
      );
      return user.u;
    }
    return this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
      },
    });
  }
}
