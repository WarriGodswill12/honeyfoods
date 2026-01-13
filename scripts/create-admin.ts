import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@honeyfoods.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log(`Admin user already exists: ${email}`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name: "Admin",
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log(`✓ Admin user created successfully`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
