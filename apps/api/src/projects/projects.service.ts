import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class ProjectsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) {}

  async create(orgId: string, data: { name: string; description?: string; environment?: string }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const [project] = await this.db
      .insert(schema.projects)
      .values({
        organizationId: orgId,
        name: data.name,
        slug,
        description: data.description,
        environment: data.environment ?? 'production',
      })
      .returning();

    return project;
  }

  async findAllForOrg(orgId: string) {
    return this.db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.organizationId, orgId));
  }

  async findOne(projectId: string, orgId: string) {
    const [project] = await this.db
      .select()
      .from(schema.projects)
      .where(and(eq(schema.projects.id, projectId), eq(schema.projects.organizationId, orgId)))
      .limit(1);

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(projectId: string, orgId: string, data: { name?: string; description?: string }) {
    const [updated] = await this.db
      .update(schema.projects)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.projects.id, projectId), eq(schema.projects.organizationId, orgId)))
      .returning();

    if (!updated) throw new NotFoundException('Project not found');
    return updated;
  }

  async remove(projectId: string, orgId: string) {
    const result = await this.db
      .delete(schema.projects)
      .where(and(eq(schema.projects.id, projectId), eq(schema.projects.organizationId, orgId)));

    return { deleted: true };
  }

  async archive(projectId: string, orgId: string) {
    return this.db
      .update(schema.projects)
      .set({ status: 'archived', updatedAt: new Date() })
      .where(and(eq(schema.projects.id, projectId), eq(schema.projects.organizationId, orgId)))
      .returning();
  }
}
