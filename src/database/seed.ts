import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/mongodb.js';
import { User } from '../models/user.model.js';

dotenv.config();

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

  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('❌ Cannot run seed: Failed to connect to MongoDB.');
    process.exit(1);
  }

  const normalizedEmail = adminEmail.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    console.log(`ℹ️  Admin user with email ${normalizedEmail} already exists.`);
    await disconnectDB();
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await User.create({
    name: adminName.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'ADMIN',
  });

  console.log(`✅ Admin user created successfully in MongoDB: ${admin.email} (${admin.name})`);
  await disconnectDB();
}

main().catch((e) => {
  console.error('❌ Error during MongoDB seed:', e);
  process.exit(1);
});
