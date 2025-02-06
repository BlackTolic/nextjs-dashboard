'use client';
import { Subscription } from './constant';
import { Card, CardBody, CardHeader, CardFooter, Input, Checkbox, Divider } from '@heroui/react';
import { useRouter } from 'next/navigation';

// 定义组件的属性接口
interface SubscriptionCardProps {
  // 订阅信息对象
  subscription: Subscription;
  // 选项变更回调函数
  onOptionsChange?: (newOptions: Subscription['selectedOptions']) => void;
  // 最大值/最小值变更回调函数
  onValueChange?: (type: 'maxValue' | 'minValue', value: number) => void;
}

// 订阅卡片组件
const SubscriptionCard = ({ subscription, onOptionsChange, onValueChange }: SubscriptionCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    const params = new URLSearchParams({
      title: subscription.title
    });
    router.push(`/dashboard/subscriptions/${subscription.id}/edit?${params.toString()}`);
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <Card className="w-72 hover:shadow-md transition-shadow">
        <Divider />
        <CardBody className="py-4">
          <h3 className="text-xl font-semibold">{subscription.title}</h3>
        </CardBody>
      </Card>
    </div>
  );
};

export default SubscriptionCard;
