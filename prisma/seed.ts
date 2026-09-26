import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    console.warn(
      '⚠️  Seed skipped: ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD environment variables are not set. No insecure default user was created.'
    );
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase().trim() },
  });

  if (existingUser) {
    console.log(`ℹ️  Admin user with email ${adminEmail} already exists.`);
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.user.create({
    data: {
      name: adminName.trim(),
      email: adminEmail.toLowerCase().trim(),
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin user created successfully: ${admin.email} (${admin.name})`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
