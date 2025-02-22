'use client';

import { useState, useEffect } from 'react';
import { fetchThoughts, Thought } from '@/app/lib/actions/investment-thoughts';
import { lusitana } from '@/app/ui/fonts';
import { LightBulbIcon, PlusIcon } from '@heroicons/react/24/outline';
import ThoughtsList from '@/app/ui/components/investment-thoughts/thoughts-list';
import ThoughtDialog from '@/app/ui/components/investment-thoughts/thought-dialog';

export default function InvestmentThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingThought, setEditingThought] = useState<Thought | null>(null);

  useEffect(() => {
    fetchThoughts().then(setThoughts);
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <LightBulbIcon className="w-6 h-6" />
          <h1 className={`${lusitana.className} text-2xl`}>投资思考</h1>
        </div>
        <button
          onClick={() => {
            setEditingThought(null);
            setIsOpen(true);
          }}
          className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <PlusIcon className="w-5 h-5" />
          新增思考
        </button>
      </div>
      <div className="mt-4">
        <ThoughtsList
          thoughts={thoughts}
          onEdit={thought => {
            setEditingThought(thought);
            setIsOpen(true);
          }}
        />
      </div>
      <ThoughtDialog
        isOpen={isOpen}
        thought={editingThought}
        onClose={() => {
          setIsOpen(false);
          setEditingThought(null);
          fetchThoughts().then(setThoughts);
        }}
      />
    </div>
  );
}
