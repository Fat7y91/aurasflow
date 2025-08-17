import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

type Brand = { primaryColor?: string } | null | undefined;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByOwner(ownerId: string) {
    return this.prisma.project.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForOwner(id: string, ownerId: string) {
    const p = await this.prisma.project.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Not found');
    if (p.ownerId !== ownerId) throw new ForbiddenException();
    return p;
  }

  async createForOwner(ownerId: string, dto: { name: string; brandJson?: Brand }) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        ownerId,
        // Prisma expects JsonValue — نعمل cast بسيط
        brandJson: (dto.brandJson ?? undefined) as Prisma.InputJsonValue,
      },
    });
  }

  async updateForOwner(id: string, ownerId: string, dto: { name?: string; brandJson?: Brand }) {
    const p = await this.prisma.project.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Not found');
    if (p.ownerId !== ownerId) throw new ForbiddenException();

    return this.prisma.project.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        brandJson: (dto.brandJson ?? undefined) as Prisma.InputJsonValue,
      },
    });
  }

  async removeForOwner(id: string, ownerId: string) {
    const p = await this.prisma.project.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Not found');
    if (p.ownerId !== ownerId) throw new ForbiddenException();

    await this.prisma.project.delete({ where: { id } });
    return { ok: true };
  }
}
