import { ConfigType, registerAs } from '@nestjs/config';
import { formatNumber } from '../common/util/string.util';

export const fileRegToken = 'file';

export const FileConfig = registerAs(fileRegToken, () => ({
  // 本地文件虚拟路径, 必须以 / 开头， 如 http://localhost:3000/static/****.jpg  , 如果不需要则 设置 ''
  staticPrefix: process.env.STATIC_PREFIX || '',
  // 文件访问前缀域名
  domain: process.env.FILE_DOMAIN || 'http://localhost:3000',
  // 文件存储的目录
  baseDir: process.env.UPLOAD_BASE_DIR || 'upload',
  // 上传的文件大小上限 单位：M 默认10M
  maxSize: formatNumber(process.env.UPLOAD_MAX_SIZE) || 10,
}));

export type IFileConfig = ConfigType<typeof FileConfig>;
