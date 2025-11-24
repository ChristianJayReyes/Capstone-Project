// Script to create an admin user in the database
// Run this with: node server/scripts/createAdminUser.js

import bcrypt from "bcryptjs";
import connectDB from "../configs/db.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function createAdminUser() {
  try {
    console.log("=== Create Admin User ===\n");

    const email = await question("Enter admin email: ");
    const password = await question("Enter admin password: ");
    const fullName = await question("Enter admin full name (or press Enter for 'Admin User'): ") || "Admin User";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await connectDB();

    // Check if user already exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      console.log("\n⚠️  User with this email already exists!");
      const update = await question("Do you want to update this user to admin? (y/n): ");
      
      if (update.toLowerCase() === "y") {
        await db.query(
          "UPDATE users SET password = ?, role = 'hotelAdmin', full_name = ? WHERE email = ?",
          [hashedPassword, fullName, email]
        );
        console.log("✅ Admin user updated successfully!");
      } else {
        console.log("❌ Operation cancelled.");
      }
    } else {
      // Insert new admin user
      await db.query(
        `INSERT INTO users (full_name, email, password, role, verified, created_at) 
         VALUES (?, ?, ?, 'hotelAdmin', 1, NOW())`,
        [fullName, email, hashedPassword]
      );
      console.log("✅ Admin user created successfully!");
    }

    console.log(`\n📧 Email: ${email}`);
    console.log(`👤 Name: ${fullName}`);
    console.log(`🔑 Role: hotelAdmin`);
    console.log("\nYou can now login with these credentials.");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    rl.close();
    process.exit(1);
  }
}

createAdminUser();

