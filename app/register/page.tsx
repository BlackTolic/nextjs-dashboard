import { Metadata } from 'next';
import { register } from '@/app/lib/actions';
import AcmeLogo from '@/app/ui/acme-logo';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '注册'
};

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <form action={register} className="space-y-3">
          <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <h1 className={`mb-3 text-2xl`}>注册账号</h1>
            <div className="w-full">
              <div>
                <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="name">
                  用户名
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                    id="name"
                    type="text"
                    name="name"
                    placeholder="请输入用户名"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
                  邮箱
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="请输入邮箱"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
                  密码
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="请输入密码（至少6位）"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>
            <Button className="mt-4 w-full">注册</Button>
          </div>
        </form>
        <div className="flex justify-center">
          <Link href="/login" className="text-sm text-blue-500 hover:text-blue-600">
            已有账号？点击登录
          </Link>
        </div>
      </div>
    </main>
  );
}
