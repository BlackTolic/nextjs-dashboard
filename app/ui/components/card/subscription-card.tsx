'use client';
import { Subscription } from './constant';
import { Card, CardBody, CardHeader, CardFooter, Input, Checkbox, Divider, Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { removeSubscription } from '@/app/lib/db/stock/subscription';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { removeSubscriptionAction } from '@/app/lib/actions/subscription';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

// 定义组件的属性接口
interface SubscriptionCardProps {
  // 订阅信息对象
  subscription: {
    id: string;
    title: string;
    description: string;
  };
}

const DeleteButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      isIconOnly
      variant="light"
      size="sm"
      isLoading={pending}
      className="text-danger hover:text-danger-600"
    >
      <TrashIcon className="h-5 w-5" />
    </Button>
  );
};

// 订阅卡片组件
const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const router = useRouter();
  const [state, formAction] = useActionState(removeSubscriptionAction, null);

  const handleCardClick = () => {
    const params = new URLSearchParams({
      title: subscription.title
    });
    router.push(`/dashboard/subscriptions/${subscription.id}/edit?${params.toString()}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡，避免触发卡片点击
    const params = new URLSearchParams({
      title: subscription.title
    });
    router.push(`/dashboard/subscriptions/${subscription.id}/edit?${params.toString()}`);
  };

  // 处理状态变化
  if (state) {
    if (state.success) {
      toast.success('删除成功');
    } else {
      toast.error(state.error || '删除失败');
    }
  }

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <Card className="w-72 hover:shadow-md transition-shadow">
        <Divider />
        <CardBody className="py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{subscription.title}</h3>
              <p className="text-sm text-gray-500">{subscription.description}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/subscriptions/${subscription.id}/edit`}>
                <Button isIconOnly variant="light" size="sm" className="text-default-400 hover:text-default-600">
                  <PencilIcon className="h-5 w-5" />
                </Button>
              </Link>
              <form action={formAction}>
                <input type="hidden" name="stockSymbol" value={subscription.id} />
                <DeleteButton />
              </form>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SubscriptionCard;
