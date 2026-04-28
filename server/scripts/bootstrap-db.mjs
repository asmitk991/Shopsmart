import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prisma from '../src/lib/prisma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.resolve(
  __dirname,
  '../prisma/migrations/20260505000000_init/migration.sql'
);

async function bootstrap() {
  const sql = await fs.readFile(migrationPath, 'utf8');
  const statements = sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }

  await prisma.$disconnect();
  console.log('SQLite schema bootstrapped from migration SQL.');
}

bootstrap().catch(async (error) => {
  console.error('Failed to bootstrap SQLite schema.', error);
  await prisma.$disconnect();
  process.exit(1);
});
