'use client';
// 替换导入的 Logo 组件
import AcmeLogo from '@/app/ui/acme-logo';
import { authenticate } from '@/app/lib/actions';
import { useActionState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  // authenticate中抛出的错误会被errorMessage捕获
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          {/* 修改此处的 className 以设置蓝色 */}
          <div className="w-32 text-blue-500">
            <AcmeLogo />
          </div>
        </div>
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              邮箱
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              aria-disabled={isPending}
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              登录
            </button>
          </div>
          <div className="flex h-8 items-end space-x-1">
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          <button
            onClick={() => (window.location.href = '/register')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            还没有账号？点击注册
          </button>
        </div>
      </div>
    </main>
  );
}
