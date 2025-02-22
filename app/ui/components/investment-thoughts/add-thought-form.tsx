'use client';

import { Card, Input, Button, Textarea } from '@heroui/react';
import { addThought } from '@/app/lib/actions/investment-thoughts';

export default function AddThoughtForm() {
  return (
    <Card className="mb-6">
      <form action={addThought}>
        <div className="p-4 space-y-4">
          <Input name="title" label="标题" placeholder="输入标题" className="w-full" required />
          <Textarea
            name="content"
            label="内容"
            placeholder="记录你的投资思考..."
            className="w-full min-h-[200px]"
            required
          />
          <div className="flex justify-end">
            <Button type="submit" color="primary">
              保存
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
