import ThoughtForm from '@/app/ui/components/investment-thoughts/thought-form';
import { getThoughtById } from '@/app/lib/db/stock/investment-thoughts';

export default async function EditThoughtPage({ params }: { params: { id: string } }) {
  const thought = await getThoughtById(params.id);
  return <ThoughtForm thought={thought} />;
}
