'use client';

import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';

export interface titleProps {
  title: string;
  children?: React.ReactNode;
  icon?: React.ReactElement; // 新增 icon 属性，用于自定义图标，默认为 ChartBarIcon
}

export default function Title(props: titleProps) {
  const { title, children, icon } = props;
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl flex items-center gap-2`}>
          {/* <ChartBarIcon className="w-6 h-6" /> */}
          {icon}
          {title}
        </h1>
      </div>

      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
