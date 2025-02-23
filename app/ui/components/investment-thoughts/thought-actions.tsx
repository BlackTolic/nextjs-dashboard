'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteThought } from '@/app/lib/actions/investment-thoughts';
import { DeleteDialog } from './delete-dialog';
import toast from 'react-hot-toast';
import type { Thought } from '@/app/lib/actions/investment-thoughts';

interface ThoughtActionsProps {
  thought: Thought;
}

export function ThoughtActions({ thought }: ThoughtActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteThought(thought.id);
      toast.success('删除成功');
      router.refresh(); // 刷新页面数据
    } catch (error) {
      toast.error('删除失败');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className="text-default-400 hover:text-default-600"
        onPress={() => router.push(`/dashboard/investment-thoughts/${thought.id}/edit`)}
      >
        <PencilIcon className="h-5 w-5" />
      </Button>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className="text-danger hover:text-danger-600"
        onPress={() => setIsDeleteDialogOpen(true)}
      >
        <TrashIcon className="h-5 w-5" />
      </Button>

      <DeleteDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={handleDelete} />
    </div>
  );
}
