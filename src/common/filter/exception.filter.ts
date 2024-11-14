import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResultDto } from 'src/common/dto/common.dto';
// import { INTERNAL_SERVER_ERROR } from '../constants/error';

/**
 * Http 异常过滤器
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    // 获取响应体
    const response = ctx.getResponse<Response>();
    // 获取状态码
    const statusCode = exception.getStatus();

    // 兼容参数校验异常
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any;
      exception.message = res.message.join(';');
    }

    // 响应结果
    const resultErr = new ResultDto(statusCode, exception.message, null);

    // 自定义异常返回体
    response.status(statusCode).json(resultErr);
  }
}

/**
 * 全局异常过滤器
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    // 获取响应体
    const response = ctx.getResponse<Response>();
    // 获取状态码，判断是HTTP异常还是服务器异常
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 响应结果
    const resultErr = new ResultDto(statusCode, 'INTERNAL_SERVER_ERROR', null);

    // 自定义异常返回体
    response.status(statusCode).json(resultErr);
  }
}
