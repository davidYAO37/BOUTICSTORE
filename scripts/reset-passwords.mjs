/**
 * Script : reset-passwords.mjs
 * Réinitialise les mots de passe de tous les utilisateurs selon leur rôle.
 * Usage : node scripts/reset-passwords.mjs
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Charger .env.local manuellement (sans dotenv)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
try {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.trim().split("=");
    if (key && !key.startsWith("#")) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
} catch {
  console.warn("⚠️  .env.local introuvable, utilisation des variables d'env système");
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI manquant dans .env.local");
  process.exit(1);
}

// Mots de passe par rôle
const PASSWORDS = {
  admin:     "Admin@2024!",
  sales:     "Sales@2024!",
  warehouse: "Warehouse@2024!",
  customer:  "Customer@2024!",
};

const UserSchema = new mongoose.Schema({
  email:     String,
  password:  String,
  firstName: String,
  lastName:  String,
  role:      String,
  isActive:  Boolean,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connecté à MongoDB\n");

  const users = await User.find({});
  if (users.length === 0) {
    console.log("⚠️  Aucun utilisateur trouvé. Création d'un admin par défaut...");
    const hash = await bcrypt.hash(PASSWORDS.admin, 12);
    await User.create({
      email:     "admin@motosboutic.ci",
      password:  hash,
      firstName: "Super",
      lastName:  "Admin",
      role:      "admin",
      isActive:  true,
    });
    console.log("✅  Admin créé : admin@motosboutic.ci");
  } else {
    for (const user of users) {
      const role = user.role || "customer";
      const plainPassword = PASSWORDS[role] || PASSWORDS.customer;
      const hash = await bcrypt.hash(plainPassword, 12);

      await User.updateOne({ _id: user._id }, { $set: { password: hash, isActive: true } });

      console.log(
        `✅  ${user.email.padEnd(35)} | rôle: ${role.padEnd(12)} | mdp: ${plainPassword}`
      );
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Mots de passe initialisés :");
  Object.entries(PASSWORDS).forEach(([role, pwd]) => {
    console.log(`  ${role.padEnd(12)} → ${pwd}`);
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  await mongoose.disconnect();
  console.log("\n✅  Terminé.");
}

main().catch((err) => {
  console.error("❌  Erreur:", err.message);
  process.exit(1);
});
