import { Thought } from '@/app/lib/actions/investment-thoughts';
import { ThoughtActions } from './thought-actions';

interface ThoughtsListProps {
  thoughts: Thought[];
}

// 服务端渲染的列表组件
export default function ThoughtsList({ thoughts }: ThoughtsListProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="divide-y divide-gray-200">
      {thoughts.map(thought => (
        <div key={thought.id} className="py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{thought.title}</h3>
            <ThoughtActions thought={thought} />
          </div>
          <p className="mt-2 text-gray-600">{thought.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            创建于 {formatDate(thought.created_at)}
            {thought.updated_at !== thought.created_at && ` · 更新于 ${formatDate(thought.updated_at)}`}
          </div>
        </div>
      ))}
    </div>
  );
}
