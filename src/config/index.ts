import { AppConfig, appRegToken, IAppConfig } from './app.config';
import {
  ISwaggerConfig,
  SwaggerConfig,
  swaggerRegToken,
} from './swagger.config';
import {
  ISecurityConfig,
  SecurityConfig,
  securityRegToken,
} from './security.config';
import { IRedisConfig, RedisConfig, redisRegToken } from './redis.config';

export * from './app.config';
export * from './swagger.config';
export * from './security.config';
export * from './redis.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [swaggerRegToken]: ISwaggerConfig;
  [securityRegToken]: ISecurityConfig;
  [redisRegToken]: IRedisConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  SwaggerConfig,
  SecurityConfig,
  RedisConfig,
};
