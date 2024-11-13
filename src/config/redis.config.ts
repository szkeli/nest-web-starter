import { ConfigType, registerAs } from '@nestjs/config';
import { formatNumber } from '../common/util/string.util';

export const redisRegToken = 'redis';

export const RedisConfig = registerAs(redisRegToken, () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: formatNumber(process.env.REDIS_PORT, 6379),
  password: process.env.REDIS_PASSWORD || '',
  db: formatNumber(process.env.REDIS_PASSWORD),
  prefix: process.env.REDIS_PREFIX || '',
}));

export type IRedisConfig = ConfigType<typeof RedisConfig>;
