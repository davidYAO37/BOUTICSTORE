const bcrypt = require("bcryptjs");
const connectToDatabase = require("../lib/mongodb").default;
const { User } = require("../models");

async function main() {
  await connectToDatabase();
  const password = await bcrypt.hash("password123", 10);
  const user = await User.create({
    email: "test@example.com",
    password,
    firstName: "Test",
    lastName: "User",
    role: "customer",
    isActive: true,
  });
  console.log("User created:", user._id.toString());
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
