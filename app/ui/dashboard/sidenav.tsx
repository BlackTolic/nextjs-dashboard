import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { nextAuth } from '@/auth';

interface SideNavProps {
  collapsed?: boolean;
}

export default function SideNav({ collapsed = false }: SideNavProps) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40" href="/">
        <div className={`text-white ${collapsed ? 'w-10' : 'w-32 md:w-40'}`}>
          {/* // 问题原因是 AcmeLogo 组件可能没有定义 collapsed 属性，下面注释掉该属性传递 */}
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks collapsed={collapsed} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await nextAuth.signOut();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">点击登出</div>
          </button>
        </form>
      </div>
    </div>
  );
}
