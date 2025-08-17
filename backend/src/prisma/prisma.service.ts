// backend/src/prisma/prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // اتصل بقاعدة البيانات أول ما السيرفر يشتغل
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Shutdown hook آمن مع Nest.
   * بنستخدم process.on بدلاً من this.$on('beforeExit') عشان نعدّي
   * مشكلة TS2345 ("beforeExit" not assignable to 'never') اللي بتحصل مع
   * بعض إصدارات Prisma/TS.
   */
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      try {
        await app.close();
      } finally {
        await this.$disconnect();
      }
    });
  }
}
