import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('member')
  @ApiOperation({ summary: 'Create a new project' })
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateProjectDto) {
    const project = await this.projectsService.create(user.orgId!, dto);
    return { success: true, data: project };
  }

  @Get()
  @ApiOperation({ summary: 'List projects in current organization' })
  async findAll(@CurrentUser() user: AuthUser) {
    const projects = await this.projectsService.findAllForOrg(user.orgId!);
    return { success: true, data: projects };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  async findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const project = await this.projectsService.findOne(id, user.orgId!);
    return { success: true, data: project };
  }

  @Patch(':id')
  @Roles('member')
  @ApiOperation({ summary: 'Update project' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    const project = await this.projectsService.update(id, user.orgId!, dto);
    return { success: true, data: project };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete project' })
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const result = await this.projectsService.remove(id, user.orgId!);
    return { success: true, data: result };
  }

  @Post(':id/archive')
  @Roles('admin')
  @ApiOperation({ summary: 'Archive project' })
  async archive(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const result = await this.projectsService.archive(id, user.orgId!);
    return { success: true, data: result };
  }
}
