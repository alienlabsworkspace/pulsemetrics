import { Injectable, ConflictException, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import * as schema from '../database/schema';
import type { JwtPayload } from './strategies/jwt.strategy';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: any,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(email: string, password: string, name: string) {
    // Check if user already exists
    const existing = await this.db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const [user] = await this.db
      .insert(schema.users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name,
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        createdAt: schema.users.createdAt,
      });

    // Create default organization for the user
    const orgSlug = this.generateSlug(name);
    const [org] = await this.db
      .insert(schema.organizations)
      .values({
        name: `${name}'s Organization`,
        slug: orgSlug,
      })
      .returning({
        id: schema.organizations.id,
        name: schema.organizations.name,
        slug: schema.organizations.slug,
      });

    // Add user as owner of their org
    await this.db.insert(schema.organizationMembers).values({
      organizationId: org.id,
      userId: user.id,
      role: 'owner',
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      orgId: org.id,
      role: 'owner',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      organization: org,
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    // Find user
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user's first organization and role
    const [membership] = await this.db
      .select({
        orgId: schema.organizationMembers.organizationId,
        role: schema.organizationMembers.role,
        orgName: schema.organizations.name,
        orgSlug: schema.organizations.slug,
      })
      .from(schema.organizationMembers)
      .innerJoin(schema.organizations, eq(schema.organizations.id, schema.organizationMembers.organizationId))
      .where(eq(schema.organizationMembers.userId, user.id))
      .limit(1);

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      orgId: membership?.orgId,
      role: membership?.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      organization: membership ? {
        id: membership.orgId,
        name: membership.orgName,
        slug: membership.orgSlug,
        role: membership.role,
      } : null,
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET', 'dev-secret-change-this'),
      });

      // Generate new token pair
      return this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        orgId: payload.orgId,
        role: payload.role,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const [user] = await this.db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        avatarUrl: schema.users.avatarUrl,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Get organizations
    const orgs = await this.db
      .select({
        id: schema.organizations.id,
        name: schema.organizations.name,
        slug: schema.organizations.slug,
        plan: schema.organizations.plan,
        role: schema.organizationMembers.role,
      })
      .from(schema.organizationMembers)
      .innerJoin(schema.organizations, eq(schema.organizations.id, schema.organizationMembers.organizationId))
      .where(eq(schema.organizationMembers.userId, userId));

    return { ...user, organizations: orgs };
  }

  private async generateTokens(payload: JwtPayload): Promise<TokenPair> {
    const accessExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '15m');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const secret = this.configService.get<string>('JWT_SECRET', 'dev-secret-change-this');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiresIn(accessExpiresIn),
    };
  }

  private parseExpiresIn(value: string): number {
    const match = value.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return 900;
    const num = parseInt(match[1]!, 10);
    const unit = match[2];
    switch (unit) {
      case 's': return num;
      case 'm': return num * 60;
      case 'h': return num * 3600;
      case 'd': return num * 86400;
      default: return 900;
    }
  }

  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${base}-${suffix}`;
  }
}
