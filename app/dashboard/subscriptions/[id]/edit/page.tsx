'use client';

import { useParams } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';
import { PencilIcon } from '@heroicons/react/24/outline';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export default function EditSubscriptionPage() {
  const { id } = useParams();

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: '我的订阅', href: '/dashboard/subscriptions' },
          {
            label: '编辑',
            href: `/dashboard/subscriptions/${id}/edit`,
            active: true
          }
        ]}
      />
      <div className="mt-4 rounded-lg bg-gray-50 p-6">
        <div className="flex flex-col gap-4">
          {/* 编辑表单内容 */}
          <p>编辑订阅 ID: {id}</p>
          {/* 这里添加编辑表单的具体实现 */}
        </div>
      </div>
    </div>
  );
}
