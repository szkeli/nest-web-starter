import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * swagger配置并启动
 * @param app
 * @param configService
 */
export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<ConfigKeyPaths>,
): void {
  const { name, port } = configService.get<IAppConfig>('app');
  const { enable, path } = configService.get<ISwaggerConfig>('swagger');

  if (!enable) return;

  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`${name} API document`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持登录
    },
  });

  // started log
  const logger = new Logger('SwaggerModule');
  logger.log(`swagger文件启动成功！ 请访问 http://127.0.0.1:${port}/${path}`);
}
