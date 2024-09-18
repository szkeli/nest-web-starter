import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class InvalidPasswordException extends HttpException {
  constructor() {
    super('Username or password incorrect', HttpStatus.BAD_REQUEST);
  }
}

export class UserExistedException extends HttpException {
  constructor() {
    super('Username has existed', HttpStatus.BAD_REQUEST);
  }
}
