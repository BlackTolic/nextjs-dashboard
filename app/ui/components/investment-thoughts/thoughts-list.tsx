'use client';

import { Thought } from '@/app/lib/actions/investment-thoughts';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteThought } from '@/app/lib/actions/investment-thoughts';

interface ThoughtsListProps {
  thoughts: Thought[];
  onEdit: (thought: Thought) => void;
}

export default function ThoughtsList({ thoughts, onEdit }: ThoughtsListProps) {
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
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(thought)} className="rounded-md p-2 hover:bg-gray-100">
                <PencilIcon className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={async () => {
                  if (confirm('确定要删除这条记录吗？')) {
                    await deleteThought(thought.id);
                    window.location.reload();
                  }
                }}
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <TrashIcon className="w-5 h-5 text-red-500" />
              </button>
            </div>
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
