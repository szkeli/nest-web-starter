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
import { LoggingService } from 'src/modules/logging/logging.service';

/**
 * Http 异常过滤器
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logging: LoggingService) {}

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

    // 记录异常日志
    this.logging.error(
      `HTTP异常 ${statusCode} - ${exception.message}`,
      exception.stack,
      'HttpExceptionFilter',
    );

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
  constructor(private readonly logging: LoggingService) {}

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

    // 获取错误信息
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'INTERNAL_SERVER_ERROR';

    // 记录异常日志
    this.logging.error(
      `全局异常 ${statusCode} - ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
      'AllExceptionsFilter',
    );

    // 响应结果
    const resultErr = new ResultDto(statusCode, message, null);

    // 自定义异常返回体
    response.status(statusCode).json(resultErr);
  }
}
