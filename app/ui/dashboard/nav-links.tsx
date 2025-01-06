// 标记为客户端组件，因为我们需要使用 usePathname 这个客户端 hook
'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

// 使用 Next.js 的 Link 组件来实现客户端导航
// Link 组件可以预加载页面并实现无刷新导航
// 相比传统的 <a> 标签，可以提供更好的用户体验
import Link from 'next/link';

// 引入 usePathname hook 用于获取当前路径
// 这样我们可以高亮显示当前激活的导航项
import { usePathname } from 'next/navigation';

// 引入 clsx 工具来动态组合 className
import clsx from 'clsx';

// 定义导航链接配置
// 包含名称、链接地址和图标
// 在大型应用中，这类配置通常存储在数据库中
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: '股票池', href: '/dashboard/stock-pool', icon: ChartBarIcon },
];

export default function NavLinks() {
  // 获取当前路径，用于确定哪个导航项处于激活状态
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        // 将图标组件赋值给 LinkIcon 变量
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
                // 基础样式：设置高度、布局、间距、圆角等
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  // 条件样式：当前路径匹配时应用高亮样式
                  'bg-sky-100 text-blue-600': pathname === link.href,
                },
            )}
          >
            {/* 渲染导航图标 */}
            <LinkIcon className="w-6" />
            {/* 在移动端隐藏文字，桌面端显示 */}
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
