import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { eq, and, isNull } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import * as schema from '../database/schema';
import { API_KEY_PREFIX } from '@pulsemetrics/shared';

@Injectable()
export class ApiKeysService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) {}

  async create(projectId: string, name: string, environment: 'production' | 'development' = 'production') {
    // Generate the full API key
    const prefix = environment === 'production' ? API_KEY_PREFIX.PRODUCTION : API_KEY_PREFIX.DEVELOPMENT;
    const randomPart = randomBytes(24).toString('hex'); // 48 chars
    const fullKey = `${prefix}${randomPart}`;
    const keyPrefix = fullKey.substring(0, 12); // First 12 chars for lookup

    // Hash the full key
    const keyHash = await bcrypt.hash(fullKey, 10);

    const [apiKey] = await this.db
      .insert(schema.apiKeys)
      .values({
        projectId,
        name,
        keyPrefix,
        keyHash,
        environment,
      })
      .returning({
        id: schema.apiKeys.id,
        projectId: schema.apiKeys.projectId,
        name: schema.apiKeys.name,
        keyPrefix: schema.apiKeys.keyPrefix,
        environment: schema.apiKeys.environment,
        createdAt: schema.apiKeys.createdAt,
      });

    // Return full key only at creation time
    return {
      ...apiKey,
      fullKey, // ⚠️ Only shown once!
    };
  }

  async findAllForProject(projectId: string) {
    return this.db
      .select({
        id: schema.apiKeys.id,
        projectId: schema.apiKeys.projectId,
        name: schema.apiKeys.name,
        keyPrefix: schema.apiKeys.keyPrefix,
        environment: schema.apiKeys.environment,
        lastUsedAt: schema.apiKeys.lastUsedAt,
        expiresAt: schema.apiKeys.expiresAt,
        revokedAt: schema.apiKeys.revokedAt,
        createdAt: schema.apiKeys.createdAt,
      })
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.projectId, projectId));
  }

  async revoke(projectId: string, keyId: string) {
    const [updated] = await this.db
      .update(schema.apiKeys)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(schema.apiKeys.id, keyId),
          eq(schema.apiKeys.projectId, projectId),
        ),
      )
      .returning();

    if (!updated) throw new NotFoundException('API key not found');
    return { revoked: true };
  }

  async rotate(projectId: string, keyId: string) {
    // Revoke old key
    await this.revoke(projectId, keyId);

    // Get old key info
    const [oldKey] = await this.db
      .select({
        name: schema.apiKeys.name,
        environment: schema.apiKeys.environment,
      })
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.id, keyId))
      .limit(1);

    if (!oldKey) throw new NotFoundException('API key not found');

    // Create new key with same name and environment
    return this.create(projectId, `${oldKey.name} (rotated)`, oldKey.environment);
  }

  /** Validate an API key and return the associated projectId */
  async validateKey(fullKey: string): Promise<{ projectId: string; environment: string } | null> {
    const keyPrefix = fullKey.substring(0, 12);

    const keys = await this.db
      .select({
        id: schema.apiKeys.id,
        projectId: schema.apiKeys.projectId,
        keyHash: schema.apiKeys.keyHash,
        environment: schema.apiKeys.environment,
      })
      .from(schema.apiKeys)
      .where(
        and(
          eq(schema.apiKeys.keyPrefix, keyPrefix),
          isNull(schema.apiKeys.revokedAt),
        ),
      );

    for (const key of keys) {
      const isValid = await bcrypt.compare(fullKey, key.keyHash);
      if (isValid) {
        // Update last used timestamp
        await this.db
          .update(schema.apiKeys)
          .set({ lastUsedAt: new Date() })
          .where(eq(schema.apiKeys.id, key.id));

        return { projectId: key.projectId, environment: key.environment };
      }
    }

    return null;
  }
}
