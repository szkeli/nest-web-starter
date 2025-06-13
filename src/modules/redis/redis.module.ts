import { Global, Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, IRedisConfig } from '../../config';

@Global() // 全局模块
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (config: ConfigService<ConfigKeyPaths>) => {
        const { host, port, db } = config.get<IRedisConfig>('redis');
        const store = await redisStore({
          socket: {
            host: host,
            port: port,
          },
          database: db,
        });
        return {
          store: store as unknown as CacheStore,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
