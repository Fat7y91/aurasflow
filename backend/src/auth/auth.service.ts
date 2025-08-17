import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  // ديمو لوجين (باسورد ثابتة زي ما كنا بنجرب: secret123)
  async login(email: string, password: string) {
    if (password !== 'secret123') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: '3615f313-617a-4dd4-bda0-01315a675a91', email, role: 'USER' };
    const access_token = await this.jwt.signAsync(payload);

    return {
      access_token,
      user: { id: payload.sub, email, role: 'USER', name: 'Omar' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
