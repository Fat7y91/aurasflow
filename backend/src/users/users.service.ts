import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; name?: string; password: string }) {
    try {
      // تشفير كلمة السر
      const hashed = await bcrypt.hash(data.password, 10);

      // إنشاء المستخدم + تحديد الحقول الراجعة (بدون password)
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashed,
          role: 'USER',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw e;
    }
  }
}
