import { fetchThoughtById } from '@/app/lib/actions/investment-thoughts';
import ThoughtForm from '@/app/ui/components/investment-thoughts/thought-form';

export default async function EditThoughtPage({ params }: { params: { id: string } }) {
  const thought = await fetchThoughtById(params.id);
  return <ThoughtForm thought={thought} />;
}
