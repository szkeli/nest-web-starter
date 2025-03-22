import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class LoggingService implements LoggerService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    // Create logs directory if it doesn't exist
    const logDir = path.join(
      process.cwd(),
      this.configService.get<string>('LOG_DIR') || 'logs',
    );
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    // 自定义格式，确保控制台输出彩色日志
    const customFormat = winston.format.printf(
      ({ level, message, timestamp, context, ...meta }) => {
        return `${timestamp} [${context || 'Application'}] ${level}: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta) : ''
        }`;
      },
    );

    // Configure Winston transports
    const transports: winston.transport[] = [
      // Console transport with improved color formatting
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.colorize({ all: true }), // 对所有内容应用颜色
          customFormat,
        ),
      }),

      // File transport with daily rotation
      new DailyRotateFile({
        dirname: logDir + '/application',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.json(),
        ),
      }),

      // Error-specific file transport
      new DailyRotateFile({
        level: 'error',
        dirname: logDir + '/error',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.json(),
        ),
      }),
    ];

    // Create Winston logger
    this.logger = winston.createLogger({
      level: this.configService.get<string>('LOG_LEVEL', 'info'),
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
      transports,
    });
  }

  // 获取调用者的上下文
  private getCallerContext(): string {
    const err = new Error();
    const stack = err.stack?.split('\n') || [];
    // 跳过前三行 (Error, getCallerContext, log/error/warn等方法)
    const callerLine = stack[3] || '';

    // 尝试从调用栈中提取类名
    const match = callerLine.match(/at\s+(.*?)\s+\(/);
    if (match && match[1]) {
      const parts = match[1].split('.');
      // 返回类名或函数名
      return parts.length > 1 ? parts[parts.length - 2] : parts[0];
    }

    return 'Application';
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context: context || this.getCallerContext() });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, {
      trace,
      context: context || this.getCallerContext(),
    });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context: context || this.getCallerContext() });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context: context || this.getCallerContext() });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, {
      context: context || this.getCallerContext(),
    });
  }
}
