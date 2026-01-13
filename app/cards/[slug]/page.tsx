import { notFound } from 'next/navigation';
import Link from 'next/link';
import { JsonCardRepository } from '@/infrastructure/repositories/JsonCardRepository';
import { GetCardUseCase } from '@/domain/use-cases/GetCard';
import { CardView } from '@/presentation/components/CardView';
import { ArrowLeft } from 'lucide-react';

export default async function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repository = new JsonCardRepository();
  const getCardUseCase = new GetCardUseCase(repository);
  const card = await getCardUseCase.execute(slug);

  if (!card) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          返回首頁
        </Link>
        
        <CardView card={card} variant="full" />
      </div>
    </div>
  );
}

// Generate static params for static export
export async function generateStaticParams() {
  const repository = new JsonCardRepository();
  const cards = await repository.listCards();
  
  return cards.map((card) => ({
    slug: card.slug,
  }));
}
