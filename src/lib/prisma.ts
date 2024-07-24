import type { PrismaClient } from '@prisma/client';
import Prisma from '@prisma/client';

export let db: PrismaClient;

if (Prisma === undefined) {
  import('@prisma/client').then(({ PrismaClient }) => {
    db = new PrismaClient();
  });
} else {
  db = new Prisma.PrismaClient();
}

// export default db;
