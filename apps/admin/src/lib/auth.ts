import type { NextAuthOptions, User } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ivyonaire.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

// Debug logging (only in development or when explicitly enabled)
const DEBUG = process.env.NODE_ENV === 'development' || process.env.AUTH_DEBUG === 'true';

function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[Auth Debug] ${message}`, data || '');
  }
}

// Log environment variable status (without exposing values)
log('Environment check', {
  hasAdminEmail: !!ADMIN_EMAIL,
  hasPasswordHash: !!ADMIN_PASSWORD_HASH,
  hasPassword: !!ADMIN_PASSWORD,
  hasNextAuthSecret: !!NEXTAUTH_SECRET,
  email: ADMIN_EMAIL,
});

async function verifyPassword(password: string): Promise<boolean> {
  if (!password) {
    log('Password is empty');
    return false;
  }

  if (ADMIN_PASSWORD_HASH) {
    // Preferred: compare against bcrypt hash from env
    try {
      const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      log('Bcrypt comparison result', { isValid });
      return isValid;
    } catch (error) {
      console.error('[Auth] Bcrypt comparison error:', error);
      return false;
    }
  }

  if (ADMIN_PASSWORD) {
    // Fallback: plain-text comparison (for local development only)
    const isValid = password === ADMIN_PASSWORD;
    log('Plain text comparison result', { isValid });
    return isValid;
  }

  // No password configured
  console.error('[Auth] No password configured! Set either ADMIN_PASSWORD_HASH or ADMIN_PASSWORD');
  return false;
}

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
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
        log('Authorize called', {
          hasEmail: !!credentials?.email,
          hasPassword: !!credentials?.password,
        });

        if (!credentials?.email || !credentials.password) {
          log('Missing email or password');
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const expectedEmail = ADMIN_EMAIL.toLowerCase().trim();

        log('Email comparison', {
          provided: email,
          expected: expectedEmail,
          match: email === expectedEmail,
        });

        if (email !== expectedEmail) {
          log('Email mismatch');
          return null;
        }

        const valid = await verifyPassword(credentials.password);
        if (!valid) {
          log('Password verification failed');
          console.error('[Auth] Authentication failed - password mismatch');
          return null;
        }

        log('Login successful');
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
