import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "./mongodb";
import { User } from "@/models";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",        type: "email"    },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await connectToDatabase();

          const normalizedEmail = credentials.email.toLowerCase().trim();

          // ── Auto-seed admin par défaut si la base est vide ───────────────
          const userCount = await User.countDocuments();
          if (userCount === 0) {
            const defaultEmail    = process.env.DEFAULT_ADMIN_EMAIL?.toLowerCase().trim() || "admin@motosboutic.ci";
            const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@2024!";

            if (normalizedEmail === defaultEmail) {
              const hash = await bcrypt.hash(defaultPassword, 12);
              const defaultAdmin = await User.create({
                email:     defaultEmail,
                password:  hash,
                firstName: "Super",
                lastName:  "Admin",
                role:      "admin",
                isActive:  true,
              });
              console.log("[AUTH] Admin par défaut créé:", defaultEmail);

              return {
                id:        defaultAdmin._id.toString(),
                email:     defaultAdmin.email,
                firstName: defaultAdmin.firstName,
                lastName:  defaultAdmin.lastName,
                role:      defaultAdmin.role,
                image:     null,
              };
            }
          }

          const dbUser = await User.findOne({ email: normalizedEmail });

          if (!dbUser)          return null; // utilisateur inexistant
          if (!dbUser.isActive) return null; // compte désactivé

          const isValid = await bcrypt.compare(credentials.password, dbUser.password);
          if (!isValid) return null; // mauvais mot de passe

          return {
            id:        dbUser._id.toString(),
            email:     dbUser.email,
            firstName: dbUser.firstName,
            lastName:  dbUser.lastName,
            role:      dbUser.role,
            image:     dbUser.avatar || null,
          };
        } catch (err) {
          console.error("[AUTH] Erreur authorize:", err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  session: {
    strategy: "jwt",
    maxAge:   30 * 24 * 60 * 60, // 30 jours
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id        = user.id;
        token.role      = user.role;
        token.firstName = user.firstName;
        token.lastName  = user.lastName;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id        = token.id        as string;
        session.user.role      = token.role      as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName  = token.lastName  as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
