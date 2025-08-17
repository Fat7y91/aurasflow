// src/projects/dto/create-project.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  // نخلّيها JSON عادي بدل كلاس داخلية عشان ما نصطدمش مع Types بتاعة Prisma
  @IsOptional()
  @IsObject()
  brandJson?: Record<string, any> | null;
}
