import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 用户不存在
 */
export class UserNotFoundException extends HttpException {
  constructor() {
    super('用户不存在', HttpStatus.NOT_FOUND);
  }
}

/**
 * 账户已被冻结
 */
export class AccountFreezeException extends HttpException {
  constructor() {
    super('账户已被冻结', HttpStatus.FORBIDDEN);
  }
}

/**
 * 登录状态异常
 */
export class LoginStatusException extends HttpException {
  constructor() {
    super('登录状态异常，请重新登录', HttpStatus.UNAUTHORIZED);
  }
}

/**
 * 用户名或密码错误
 */
export class InvalidPasswordException extends HttpException {
  constructor() {
    super('用户名或密码错误', HttpStatus.BAD_REQUEST);
  }
}
