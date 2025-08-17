import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

type CreateProjectDto = { name: string; brandJson?: { primaryColor?: string } | null };
type UpdateProjectDto = { name?: string; brandJson?: { primaryColor?: string } | null };

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  findMine(@Req() req: any) {
    return this.projects.findAllByOwner(req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.projects.createForOwner(req.user.id, dto);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.projects.findOneForOwner(id, req.user.id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.updateForOwner(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.projects.removeForOwner(id, req.user.id);
  }
}
