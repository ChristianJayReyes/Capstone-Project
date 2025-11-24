// Quick script to hash a password for admin user
// Run: node server/scripts/hashPassword.js

import bcrypt from "bcryptjs";

const password = process.argv[2] || "admin123";

bcrypt.hash(password, 10).then((hash) => {
  console.log("\n=== Password Hash ===");
  console.log("Original password:", password);
  console.log("Hashed password:", hash);
  console.log("\nUse this hash in your SQL INSERT or UPDATE statement:");
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@example.com';`);
  console.log("\nOr use this full SQL:");
  console.log(`UPDATE users SET password = '${hash}', role = 'hotelAdmin' WHERE email = 'admin@example.com';`);
  process.exit(0);
});

