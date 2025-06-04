import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   // 拦截请求并修改
//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set('x-request-from', 'middleware');
//   console.log('middleware');
//   // 可以在这里添加认证检查等逻辑
//   // if (!request.cookies.has('auth-token')) {
//   //   return NextResponse.redirect(new URL('/login', request.url));
//   // }

//   // 继续处理请求
//   return NextResponse.next({
//     request: {
//       headers: requestHeaders
//     }
//   });
// }

export default NextAuth(authConfig).auth;

// 配置拦截路径
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
