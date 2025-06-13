import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IRedisConfig, RedisConfig } from '../../config';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(RedisConfig.KEY) readonly redisConfig: IRedisConfig,
  ) {}

  /**
   * 获取缓存
   * @param key
   */
  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get(this.redisConfig.prefix + ':' + key);
  }

  /**
   * 设置缓存
   * @param key
   * @param value
   * @param ttl 缓存时间 单位秒 不传为永久
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(
      this.redisConfig.prefix + ':' + key,
      value,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      { ttl },
    );
  }

  /**
   * 删除缓存
   * @param key
   */
  async del(key: string): Promise<void> {
    return await this.cacheManager.del(this.redisConfig.prefix + ':' + key);
  }
}
