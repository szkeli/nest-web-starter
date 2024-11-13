import { ConfigType, registerAs } from '@nestjs/config';
import { formatBoolean } from '../common/util/string.util';

export const swaggerRegToken = 'swagger';

export const SwaggerConfig = registerAs(swaggerRegToken, () => ({
  enable: formatBoolean(process.env.SWAGGER_ENABLE),
  path: process.env.SWAGGER_PATH || 'swagger',
}));

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>;
