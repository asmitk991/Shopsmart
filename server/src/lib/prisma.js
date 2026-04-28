process.env.DATABASE_URL ??= process.env.NODE_ENV === 'test' ? 'file:./test.db' : 'file:./dev.db';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
