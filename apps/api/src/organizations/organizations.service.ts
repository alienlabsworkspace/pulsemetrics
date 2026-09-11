import { Injectable, Inject, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class OrganizationsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) {}

  async create(userId: string, name: string, slug?: string) {
    const orgSlug = slug ?? this.generateSlug(name);

    // Check slug uniqueness
    const existing = await this.db
      .select({ id: schema.organizations.id })
      .from(schema.organizations)
      .where(eq(schema.organizations.slug, orgSlug))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Organization slug already taken');
    }

    const [org] = await this.db
      .insert(schema.organizations)
      .values({ name, slug: orgSlug })
      .returning();

    // Creator is owner
    await this.db.insert(schema.organizationMembers).values({
      organizationId: org.id,
      userId,
      role: 'owner',
    });

    return org;
  }

  async findAllForUser(userId: string) {
    return this.db
      .select({
        id: schema.organizations.id,
        name: schema.organizations.name,
        slug: schema.organizations.slug,
        plan: schema.organizations.plan,
        role: schema.organizationMembers.role,
        createdAt: schema.organizations.createdAt,
      })
      .from(schema.organizationMembers)
      .innerJoin(schema.organizations, eq(schema.organizations.id, schema.organizationMembers.organizationId))
      .where(eq(schema.organizationMembers.userId, userId));
  }

  async findOne(orgId: string, userId: string) {
    const [result] = await this.db
      .select({
        id: schema.organizations.id,
        name: schema.organizations.name,
        slug: schema.organizations.slug,
        plan: schema.organizations.plan,
        role: schema.organizationMembers.role,
        createdAt: schema.organizations.createdAt,
        updatedAt: schema.organizations.updatedAt,
      })
      .from(schema.organizations)
      .innerJoin(
        schema.organizationMembers,
        and(
          eq(schema.organizationMembers.organizationId, schema.organizations.id),
          eq(schema.organizationMembers.userId, userId),
        ),
      )
      .where(eq(schema.organizations.id, orgId))
      .limit(1);

    if (!result) {
      throw new NotFoundException('Organization not found');
    }

    return result;
  }

  async update(orgId: string, userId: string, data: { name?: string }) {
    await this.ensureRole(orgId, userId, 'admin');

    const [updated] = await this.db
      .update(schema.organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.organizations.id, orgId))
      .returning();

    return updated;
  }

  async remove(orgId: string, userId: string) {
    await this.ensureRole(orgId, userId, 'owner');

    await this.db
      .delete(schema.organizations)
      .where(eq(schema.organizations.id, orgId));

    return { deleted: true };
  }

  // ─── Members ─────────────────────────────────────────────

  async getMembers(orgId: string) {
    return this.db
      .select({
        id: schema.organizationMembers.id,
        userId: schema.organizationMembers.userId,
        role: schema.organizationMembers.role,
        joinedAt: schema.organizationMembers.joinedAt,
        userName: schema.users.name,
        userEmail: schema.users.email,
        userAvatar: schema.users.avatarUrl,
      })
      .from(schema.organizationMembers)
      .innerJoin(schema.users, eq(schema.users.id, schema.organizationMembers.userId))
      .where(eq(schema.organizationMembers.organizationId, orgId));
  }

  async inviteMember(orgId: string, inviterId: string, email: string, role: string) {
    await this.ensureRole(orgId, inviterId, 'admin');

    // Find user by email
    const [user] = await this.db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found with that email');
    }

    // Check if already a member
    const [existing] = await this.db
      .select({ id: schema.organizationMembers.id })
      .from(schema.organizationMembers)
      .where(
        and(
          eq(schema.organizationMembers.organizationId, orgId),
          eq(schema.organizationMembers.userId, user.id),
        ),
      )
      .limit(1);

    if (existing) {
      throw new ConflictException('User is already a member');
    }

    const [member] = await this.db
      .insert(schema.organizationMembers)
      .values({
        organizationId: orgId,
        userId: user.id,
        role,
      })
      .returning();

    return member;
  }

  async updateMemberRole(orgId: string, updaterId: string, targetUserId: string, newRole: string) {
    await this.ensureRole(orgId, updaterId, 'admin');

    // Cannot change owner role
    const [target] = await this.db
      .select({ role: schema.organizationMembers.role })
      .from(schema.organizationMembers)
      .where(
        and(
          eq(schema.organizationMembers.organizationId, orgId),
          eq(schema.organizationMembers.userId, targetUserId),
        ),
      )
      .limit(1);

    if (!target) {
      throw new NotFoundException('Member not found');
    }

    if (target.role === 'owner') {
      throw new ForbiddenException('Cannot change owner role');
    }

    const [updated] = await this.db
      .update(schema.organizationMembers)
      .set({ role: newRole })
      .where(
        and(
          eq(schema.organizationMembers.organizationId, orgId),
          eq(schema.organizationMembers.userId, targetUserId),
        ),
      )
      .returning();

    return updated;
  }

  async removeMember(orgId: string, removerId: string, targetUserId: string) {
    await this.ensureRole(orgId, removerId, 'admin');

    // Cannot remove owner
    const [target] = await this.db
      .select({ role: schema.organizationMembers.role })
      .from(schema.organizationMembers)
      .where(
        and(
          eq(schema.organizationMembers.organizationId, orgId),
          eq(schema.organizationMembers.userId, targetUserId),
        ),
      )
      .limit(1);

    if (!target) throw new NotFoundException('Member not found');
    if (target.role === 'owner') throw new ForbiddenException('Cannot remove the owner');

    await this.db
      .delete(schema.organizationMembers)
      .where(
        and(
          eq(schema.organizationMembers.organizationId, orgId),
          eq(schema.organizationMembers.userId, targetUserId),
        ),
      );

    return { removed: true };
  }

  // ─── Helpers ─────────────────────────────────────────────

  private async ensureRole(orgId: string, userId: string, minRole: 'admin' | 'owner') {
    const roleHierarchy: Record<string, number> = { viewer: 0, member: 1, admin: 2, owner: 3 };

    const [membership] = await this.db
      .select({ role: schema.organizationMembers.role })
      .from(schema.organizationMembers)
      .where(
        and(
          eq(schema.organizationMembers.organizationId, orgId),
          eq(schema.organizationMembers.userId, userId),
        ),
      )
      .limit(1);

    if (!membership) throw new ForbiddenException('Not a member of this organization');

    const userLevel = roleHierarchy[membership.role] ?? 0;
    const requiredLevel = roleHierarchy[minRole] ?? 99;

    if (userLevel < requiredLevel) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }

  private generateSlug(name: string): string {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${base}-${suffix}`;
  }
}
