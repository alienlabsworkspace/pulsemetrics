import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto, InviteMemberDto, UpdateMemberRoleDto } from './dto/organization.dto';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrganizationDto) {
    const org = await this.orgService.create(user.userId, dto.name, dto.slug);
    return { success: true, data: org };
  }

  @Get()
  @ApiOperation({ summary: 'List current user organizations' })
  async findAll(@CurrentUser() user: AuthUser) {
    const orgs = await this.orgService.findAllForUser(user.userId);
    return { success: true, data: orgs };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization details' })
  async findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const org = await this.orgService.findOne(id, user.userId);
    return { success: true, data: org };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    const org = await this.orgService.update(id, user.userId, dto);
    return { success: true, data: org };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization' })
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const result = await this.orgService.remove(id, user.userId);
    return { success: true, data: result };
  }

  // ─── Members ─────────────────────────────────────────────

  @Get(':id/members')
  @ApiOperation({ summary: 'List organization members' })
  async getMembers(@Param('id') id: string) {
    const members = await this.orgService.getMembers(id);
    return { success: true, data: members };
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Invite a member to the organization' })
  async inviteMember(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: InviteMemberDto) {
    const member = await this.orgService.inviteMember(id, user.userId, dto.email, dto.role);
    return { success: true, data: member };
  }

  @Patch(':id/members/:userId')
  @ApiOperation({ summary: 'Update member role' })
  async updateRole(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    const result = await this.orgService.updateMemberRole(id, user.userId, targetUserId, dto.role);
    return { success: true, data: result };
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove member from organization' })
  async removeMember(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
  ) {
    const result = await this.orgService.removeMember(id, user.userId, targetUserId);
    return { success: true, data: result };
  }
}
