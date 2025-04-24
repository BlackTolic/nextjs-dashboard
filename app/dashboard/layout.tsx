'use server';
import SideNav from '@/app/ui/dashboard/sidenav';
import { headers } from 'next/headers';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// export const experimental_ppr = true;

// 为解决 "仅允许在异步函数和模块顶级使用 'await' 表达式" 的问题，将 Layout 函数改为异步函数
// 并移除多余的 headersList 声明
export default async function Layout({ children }: { children: React.ReactNode }) {
  const getPathname = async () => {
    const headersList = await headers();
    return headersList.get('x-pathname') || '';
  };

  const pathname = await getPathname();
  const collapsed = pathname.includes('collapsed=true');

  const handleToggle = async function () {
    'use server';
    const newPath = collapsed
      ? pathname.replace('collapsed=true', '')
      : `${pathname}${pathname.includes('?') ? '&' : '?'}collapsed=true`;
    // window.location.href = newPath;
  };

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className={`relative ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
        <SideNav collapsed={collapsed} />
        {/* <form action={handleToggle}>
          <button
            // 由于 <button> 元素没有 'href' 属性，将其替换为 'onClick' 事件处理程序，
            // 并使用 window.location.href 来实现页面跳转
            className="absolute right-0 top-1/2 -mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 shadow-md hover:bg-gray-300"
            // 移除导致类型错误的 prefetch 属性，因为 HTMLButtonElement 没有该属性
          >
            {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </button>
        </form> */}
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
