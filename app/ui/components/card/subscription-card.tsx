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
import { useActionState, useEffect } from 'react';

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
  const [state, formAction] = useActionState(removeSubscriptionAction, {
    success: false,
    error: undefined
  });

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

  useEffect(() => {
    if (state?.success) {
      toast.success('删除成功');
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div onClick={handleCardClick} className="cursor-pointer w-full">
      <Card className="w-full max-w-xs md:max-w-sm lg:max-w-md hover:shadow-md transition-shadow">
        <Divider />
        <CardBody className="py-4 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold truncate">{subscription.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{subscription.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link href={`/dashboard/subscriptions/${subscription.id}/edit?title=${subscription.title}`}>
                <Button isIconOnly variant="light" size="sm" className="text-default-400 hover:text-default-600">
                  <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
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
