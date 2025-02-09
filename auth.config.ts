import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  callbacks: {
    // 成功：auth {
    //   user: { name: 'User', email: 'user@nextmail.com' },
    //   expires: '2025-02-05T02:18:11.898Z'
    // }
    // 失败：null
    authorized({ auth, request: { nextUrl } }) {
      // console.log(auth, 'auth');
      // console.log(nextUrl, '99999');
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // console.log(isOnDashboard, 'isOnDashboard');
      // console.log(isLoggedIn, 'isLoggedIn');
      // 前往dashboard页面
      if (isOnDashboard) {
        return isLoggedIn;
        // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    }
  },
  providers: [] // Add providers with an empty array for now
} satisfies NextAuthConfig;
