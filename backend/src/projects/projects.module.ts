import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [AuthModule], // ← دي اللي كانت عاملة Unknown strategy لما مش موجودة
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectsModule {}
