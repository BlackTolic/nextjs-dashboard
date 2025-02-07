'use server';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import CandlestickChart from '@/app/ui/components/charts/candlestick-chart';

interface ContextProps {
  searchParams: {
    title?: string;
    [key: string]: string | string[] | undefined;
  };
  params: {
    id?: string;
  };
}

export default async function EditSubscriptionPage(context: ContextProps) {
  // 获取订阅ID（从服务端获取url参数必须用异步获取）
  const { id = '' } = await Promise.resolve(context.params);
  const { title = '' } = await Promise.resolve(context.searchParams);

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: '我的订阅', href: '/dashboard/subscriptions' },
          {
            label: title,
            href: `/dashboard/subscriptions/${id}/edit`,
            active: true
          }
        ]}
      />
      <div className="mt-4 rounded-lg bg-gray-50 p-6">
        <div className="flex flex-col gap-4">
          {/* 编辑表单内容 */}
          {/* <p>编辑订阅 ID: {id}</p> */}
          {/* 这里添加编辑表单的具体实现 */}

          {/* K线图展示 */}
          <div className="mt-8">
            <CandlestickChart symbol={id} title={title} />
          </div>
        </div>
      </div>
    </div>
  );
}
