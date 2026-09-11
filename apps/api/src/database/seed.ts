import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://pulsemetrics:pulsemetrics@localhost:5432/pulsemetrics';

async function seed() {
  console.log('🌱 Seeding PulseMetrics database...');

  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool, { schema });

  // ─── Create demo user ────────────────────────────────────
  const passwordHash = await bcrypt.hash('demo1234', 12);

  const [user] = await db
    .insert(schema.users)
    .values({
      email: 'demo@pulsemetrics.io',
      passwordHash,
      name: 'Demo User',
      avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=DU',
    })
    .returning()
    .onConflictDoNothing();

  if (!user) {
    console.log('⚠️ Demo user already exists, skipping seed');
    await pool.end();
    return;
  }

  console.log(`✅ Created user: ${user.email}`);

  // ─── Create demo organization ────────────────────────────
  const [org] = await db
    .insert(schema.organizations)
    .values({
      name: 'PulseMetrics Demo',
      slug: 'pulsemetrics-demo',
      plan: 'pro',
    })
    .returning();

  await db.insert(schema.organizationMembers).values({
    organizationId: org.id,
    userId: user.id,
    role: 'owner',
  });

  console.log(`✅ Created organization: ${org.name}`);

  // ─── Create demo projects ───────────────────────────────
  const projects = [
    { name: 'PulseMetrics Dashboard', slug: 'dashboard', env: 'production' },
    { name: 'Marketing Site', slug: 'marketing', env: 'production' },
    { name: 'API Docs', slug: 'api-docs', env: 'development' },
  ];

  for (const p of projects) {
    const [project] = await db
      .insert(schema.projects)
      .values({
        organizationId: org.id,
        name: p.name,
        slug: p.slug,
        description: `${p.name} analytics tracking`,
        environment: p.env,
      })
      .returning();

    console.log(`✅ Created project: ${project.name}`);

    // Create API key for each project
    const { randomBytes } = await import('crypto');
    const prefix = p.env === 'production' ? 'pk_live_' : 'pk_test_';
    const randomPart = randomBytes(24).toString('hex');
    const fullKey = `${prefix}${randomPart}`;
    const keyHash = await bcrypt.hash(fullKey, 10);

    await db.insert(schema.apiKeys).values({
      projectId: project.id,
      name: `${p.name} - Default Key`,
      keyPrefix: fullKey.substring(0, 12),
      keyHash,
      environment: p.env,
    });

    console.log(`  🔑 API Key: ${fullKey.substring(0, 20)}...`);
  }

  // ─── Create demo alert rules ─────────────────────────────
  const [firstProject] = await db
    .select({ id: schema.projects.id })
    .from(schema.projects)
    .where(schema.projects.slug.equals?.('dashboard') as any)
    .limit(1);

  if (firstProject) {
    await db.insert(schema.alertRules).values([
      {
        projectId: firstProject.id,
        name: 'High Error Rate',
        conditionType: 'error_rate',
        threshold: '5.0',
        durationSeconds: 300,
        severity: 'critical',
      },
      {
        projectId: firstProject.id,
        name: 'Low Ingestion',
        conditionType: 'low_ingestion',
        threshold: '100',
        durationSeconds: 600,
        severity: 'warning',
      },
      {
        projectId: firstProject.id,
        name: 'Traffic Spike',
        conditionType: 'traffic_spike',
        threshold: '500',
        durationSeconds: 60,
        severity: 'info',
      },
    ]);

    console.log('✅ Created alert rules');
  }

  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Demo credentials:');
  console.log('   Email:    demo@pulsemetrics.io');
  console.log('   Password: demo1234\n');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
