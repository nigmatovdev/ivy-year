import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Only allow authenticated admin users
      return !!token && (token as any).role === 'admin';
    },
  },
});

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - /api/auth (NextAuth routes)
     * - /login (public sign-in page)
     * - Next.js static assets
     */
    '/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)',
  ],
};


