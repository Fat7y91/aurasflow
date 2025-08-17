import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

type LoginDto = { email: string; password: string };

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    // لاغين أي Cookie هنا — برجع الـ access_token فقط
    return this.auth.login(dto.email, dto.password);
  }

  @Post('logout')
  async logout() {
    // End-point شكلي للواجهة (مفيش state على السيرفر)
    return { ok: true };
  }
}
