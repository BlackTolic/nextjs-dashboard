'use server';
import ThoughtForm from '@/app/ui/components/investment-thoughts/thought-form';

export default async function NewThoughtPage() {
  return <ThoughtForm thought={null} />;
}
