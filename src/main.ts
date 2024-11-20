import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, IAppConfig, IFileConfig } from './config';
import { setupSwagger } from './setup-swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 获取配置
  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { port, globalPrefix } = configService.get<IAppConfig>('app');

  const { staticPrefix, baseDir } = configService.get<IFileConfig>('file');

  // 静态资源映射
  app.useStaticAssets(join(__dirname, '..', `${baseDir}`), {
    prefix: `${staticPrefix}`,
  });

  app.setGlobalPrefix(globalPrefix);

  // 启动swagger
  setupSwagger(app, configService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(port);
}
bootstrap();
