import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          console.log("Auth Debug: User not found or no password", credentials.email);
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          console.log("Auth Debug: Password mismatch for", credentials.email, "Input length:", (credentials.password as string).length);
          return null;
        }

        console.log("Auth Debug: Password MATCHED for", credentials.email);

        return {
          id: user.id,
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
        token.role = (user as any).role;
      }

      const userId = token.id || token.sub;
      if (userId) {
        token.id = userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userId = (token.id || token.sub) as string;
        session.user.id = userId;
        
        // Fetch fresh role directly from DB on every session access
        // This guarantees server components always see the latest role
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
          });
          if (dbUser) {
            (session.user as any).role = dbUser.role;
          } else {
            (session.user as any).role = token.role;
          }
        } catch (e) {
          (session.user as any).role = token.role;
        }
      }
      return session;
    },
  },
});
