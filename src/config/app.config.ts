import { ConfigType, registerAs } from '@nestjs/config';
import { formatNumber } from '../common/util/string.util';

export const appRegToken = 'app';

const globalPrefix = process.env.GLOBAL_PREFIX || '';
export const AppConfig = registerAs(appRegToken, () => ({
  port: formatNumber(process.env.APP_PORT, 3000),
  globalPrefix,
  name: process.env.APP_NAME,
}));

export type IAppConfig = ConfigType<typeof AppConfig>;

/**
 * 免鉴权路由(白名单)
 */
export const RouterWhiteList: string[] = [
  `${globalPrefix ? '/' : ''}${globalPrefix}/auth/login`,
];
