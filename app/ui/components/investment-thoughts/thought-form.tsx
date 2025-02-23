'use server';

import { addThought, updateThought, type Thought } from '@/app/lib/actions/investment-thoughts';
// import { Button } from '@heroui/react';
import { redirect } from 'next/navigation';

export default async function ThoughtForm({ thought }: { thought: Thought | null }) {
  async function handleSubmit(formData: FormData) {
    'use server';
    console.log(formData);

    try {
      if (thought) {
        await updateThought(thought.id, formData);
      } else {
        await addThought(formData);
      }
    } catch (error) {
      console.error(error);
      // throw new Error('保存失败，请重试');
    } finally {
      redirect('/dashboard/investment-thoughts');
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">标题</label>
        <input
          type="text"
          name="title"
          defaultValue={thought?.title}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">内容</label>
        <textarea
          name="content"
          defaultValue={thought?.content}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
      <div className="flex justify-end gap-3">
        <a
          href="/dashboard/investment-thoughts"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          取消
        </a>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          保存
        </button>
      </div>
    </form>
  );
}
