import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://pulsemetrics:pulsemetrics@localhost:5432/pulsemetrics',
  },
  verbose: true,
  strict: true,
});
