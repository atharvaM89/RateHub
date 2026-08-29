import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  const adminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'ADMIN' },
  });

  const userRole = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: 'USER' },
  });

  const ownerRole = await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, name: 'STORE_OWNER' },
  });

  console.log('Roles seeded successfully.');

  // Seed initial administrator
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await argon2.hash('Admin@123');
    const adminUser = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: adminEmail,
        passwordHash,
        address: 'RateHub Headquarters, Mumbai',
        roleId: 1, // ADMIN
        isActive: true,
      },
    });
    console.log('Admin user created:', adminUser.email);
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
