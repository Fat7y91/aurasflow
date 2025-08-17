// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // اسمح للفرونت إند (3001) يطلب من الباك إند (3000)
  app.enableCors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true,
  });

  // تفعيل shutdown hook
  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);

  // اسمع على 0.0.0.0 عشان مايحصلش رفض اتصال من المتصفح
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`API running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
