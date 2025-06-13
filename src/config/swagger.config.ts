import { ConfigType, registerAs } from '@nestjs/config';
import { formatBoolean } from '../common/util/string.util';

export const swaggerRegToken = 'swagger';

export const SwaggerConfig = registerAs(swaggerRegToken, () => ({
  enable: formatBoolean(process.env.SWAGGER_ENABLE),
  path: process.env.SWAGGER_PATH || 'swagger',
  // 包装响应结果
  wrapResponse: formatBoolean(process.env.SWAGGER_WRAP_RESPONSE),
}));

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>;
