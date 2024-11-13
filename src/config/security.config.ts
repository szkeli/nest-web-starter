import { ConfigType, registerAs } from '@nestjs/config';

export const securityRegToken = 'security';

export const SecurityConfig = registerAs(securityRegToken, () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExprire: process.env.JWT_EXPIRE,
}));

export type ISecurityConfig = ConfigType<typeof SecurityConfig>;
