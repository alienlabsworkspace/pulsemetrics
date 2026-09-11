import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/api-key.dto';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('API Keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new API key for a project' })
  async create(@Param('projectId') projectId: string, @Body() dto: CreateApiKeyDto) {
    const apiKey = await this.apiKeysService.create(projectId, dto.name, dto.environment);
    return { success: true, data: apiKey };
  }

  @Get()
  @ApiOperation({ summary: 'List API keys for a project' })
  async findAll(@Param('projectId') projectId: string) {
    const keys = await this.apiKeysService.findAllForProject(projectId);
    return { success: true, data: keys };
  }

  @Delete(':keyId')
  @Roles('admin')
  @ApiOperation({ summary: 'Revoke an API key' })
  async revoke(@Param('projectId') projectId: string, @Param('keyId') keyId: string) {
    const result = await this.apiKeysService.revoke(projectId, keyId);
    return { success: true, data: result };
  }

  @Post(':keyId/rotate')
  @Roles('admin')
  @ApiOperation({ summary: 'Rotate an API key (revoke old + create new)' })
  async rotate(@Param('projectId') projectId: string, @Param('keyId') keyId: string) {
    const newKey = await this.apiKeysService.rotate(projectId, keyId);
    return { success: true, data: newKey };
  }
}
