'use server';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/button';
import { register } from '@/app/lib/actions';

export default async function RegisterForm() {
  const [state, dispatch] = useActionState(register, undefined);

  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>注册账号</h1>
        <div className="w-full">
          <div>
            {/* <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="name">
              姓名
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder="请输入姓名"
                required
              />
            </div> */}
          </div>
          <div>
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
        <RegisterButton />
        <div className="flex h-8 items-end space-x-1">
          {state?.message && (
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500">{state.message}</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      {pending ? '注册中...' : '注册'}
    </Button>
  );
}
