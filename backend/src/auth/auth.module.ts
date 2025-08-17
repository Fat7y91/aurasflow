import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // لازم ال Passport يتسجل مع defaultStrategy=jwt
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  // مهم جداً نعمل export لـ PassportModule و JwtModule
  // علشان أي Module تاني (زي ProjectsModule) يقدر يستخدم الجارد/الستراتيجي
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
