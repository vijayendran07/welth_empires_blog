const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true }, orderBy: { createdAt: 'desc' } }).then(console.log).catch(console.error).finally(() => prisma.$disconnect());
