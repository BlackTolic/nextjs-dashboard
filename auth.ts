/**
 * Auth.js 官网中介绍到，Auth.js 是一个适用于 Next.js 应用程序的完整开源身份验证解决方案，从设计之初就支持 Next.js 和 Serverless。
 * Auth.js 是灵活且容易使用的，它可以与任何一种 OAuth 服务一起使用，如 OAuth 1.0、1.0A、2.0，同时支持当今流行的登录服务，如 Github、Twitter、Google 等，支持电子邮件和无密码形式的身份验证。
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// 获取数据库中的用户信息
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    console.log(user.rows[0], 'user');
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // 这里可以添加多种验证方式，这里展示使用Credentials provider
  providers: [
    Credentials({
      // credentials:{email,password,callbackUrl}
      async authorize(credentials) {
        // 获取表单格式校验的验证信息
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        // 输入格式正确
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // 数据库中的用户信息 {id,name,email,password:hash加密}
          const user = await getUser(email);
          console.log(user, 'user99');
          if (!user) return null;
          // todo 使用bcrypt比对密码
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
