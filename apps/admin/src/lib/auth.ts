import type { NextAuthOptions, User } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ivyonaire.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function verifyPassword(password: string): Promise<boolean> {
  if (ADMIN_PASSWORD_HASH) {
    // Preferred: compare against bcrypt hash from env
    return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  }

  if (ADMIN_PASSWORD) {
    // Fallback: plain-text comparison (for local development only)
    return password === ADMIN_PASSWORD;
  }

  // No password configured
  return false;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials.password) {
          console.log('[Auth] Missing email or password');
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const expectedEmail = ADMIN_EMAIL.toLowerCase().trim();

        if (email !== expectedEmail) {
          console.log('[Auth] Email mismatch:', { provided: email, expected: expectedEmail });
          return null;
        }

        const valid = await verifyPassword(credentials.password);
        if (!valid) {
          console.log('[Auth] Password verification failed');
          return null;
        }

        console.log('[Auth] Login successful');
        return {
          id: 'admin',
          name: 'Ivyonaire Admin',
          email: ADMIN_EMAIL,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}

