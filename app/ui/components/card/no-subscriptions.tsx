import { FolderIcon } from '@heroicons/react/24/outline';

export function NoSubscriptions({ message = '暂无订阅信息' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[450px] gap-2">
      <FolderIcon className="w-16 h-16 text-gray-400" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
