import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 上传文件大小异常
 */
export class FileSizeException extends HttpException {
  constructor() {
    super('上传文件大小异常', HttpStatus.BAD_REQUEST);
  }
}
