// import prisma from '@prisma/client';
// import pkg from '@prisma/client';
// const { PrismaClient } = pkg;
// export const db = new PrismaClient();

import Prisma, * as PrismaScope from '@prisma/client';
const PrismaClient = Prisma?.PrismaClient || PrismaScope?.PrismaClient;
export const db = new PrismaClient();
