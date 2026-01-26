// NextAuth configuration
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Create Convex client for server-side auth
        const convex = new ConvexHttpClient(
          process.env.NEXT_PUBLIC_CONVEX_URL!,
        );

        const user = await convex.query(api.users.getUserByEmail, {
          email: credentials.email,
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (reduced from 30 days for security)
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
