import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, ISecurityConfig } from '../../config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService<ConfigKeyPaths>) => {
        const { jwtSecret, jwtExprire } =
          config.get<ISecurityConfig>('security');

        return {
          global: true,
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExprire,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
