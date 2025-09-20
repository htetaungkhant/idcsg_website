import { hashPassword } from "@/lib/password";
import db from "@/lib/db/db";

async function main() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "Admin email or password not set in environment variables"
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(adminPassword);

    // Check if previous admin credentials exist
    const previousCredentials = await db.previousAdminCredentials.findFirst();

    if (!previousCredentials) {
      // No previous credentials exist - this is initial setup

      await db.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: "Administrator",
        },
      });
      console.log("Initial admin user created successfully");

      // Store current credentials as previous credentials for future updates
      await db.previousAdminCredentials.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
        },
      });

      console.log("Previous admin credentials stored successfully");
      return {
        success: true,
        message: "Admin user setup completed successfully",
      };
    } else {
      // Previous credentials exist - find and update admin using previous credentials
      const existingAdmin = await db.user.findUnique({
        where: { email: previousCredentials.email },
      });

      if (!existingAdmin) {
        console.log("Admin user with previous credentials does not exist.");
        return {
          success: false,
          message: "Admin user with previous credentials does not exist",
        };
      }

      // Update existing admin user with new credentials
      await db.user.update({
        where: { email: previousCredentials.email },
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: "Administrator",
        },
      });

      // Update the stored previous credentials with the new ones
      await db.previousAdminCredentials.update({
        where: { id: previousCredentials.id },
        data: {
          email: adminEmail,
          password: hashedPassword,
        },
      });

      console.log("Admin user updated successfully");
      return { success: true, message: "Admin user updated successfully" };
    }
  } catch (error) {
    console.error("Error managing admin user:", error);
    return { success: false, message: "Failed to manage admin user" };
  }
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
