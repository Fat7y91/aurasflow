// backend/src/prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // بعض الإصدارات بتدي typing ضايع على $on -> نستخدم cast بسيط
    (this.$on as any)('beforeExit', async () => {
      await app.close();
    });
  }
}
