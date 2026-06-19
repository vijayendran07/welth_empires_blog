const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const articles = await prisma.article.findMany({ select: { views: true, published: true, createdAt: true } });
    console.log('ARTICLES:', articles.length);
  } catch (e) {
    console.error('DB ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
