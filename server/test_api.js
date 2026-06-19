const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

async function test() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({ where: { email: 'admin@wealthempires.com' } });
  
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'wealth-empires-super-secret-key-change-me', { expiresIn: '7d' });

  try {
    const res = await fetch('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(res.status);
    console.log(await res.text());
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
