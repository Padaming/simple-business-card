import Link from 'next/link';
import { Card as CardUI, CardContent } from '@/presentation/components/ui/card';
import { Card } from '@/domain/entities/Card';

interface ExampleCardsProps {
  cards: Card[];
}

export function ExampleCards({ cards }: ExampleCardsProps) {
  if (cards.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
        <p className="text-lg text-gray-900 mb-2">目前還沒有名片</p>
        <p className="text-sm text-gray-400 mb-6">成為第一個建立名片的人！</p>
        <Link
          href="/editor"
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Create your first card"
        >
          建立名片
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full" data-testid="example-cards-container">
      {cards.slice(0, 3).map((card) => (
        <div key={card.slug} className="w-full md:flex-1 min-w-0">
          <Link href={`/cards/${card.slug}`} className="group block h-full no-underline text-gray-900">
            <CardUI className="h-full border-0 shadow-sm hover:shadow-md hover:bg-[#D9CD90] bg-white transition-all duration-500">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="mb-4 relative">
                  {card.avatar ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <img
                        src={card.avatar}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                      {card.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-0 line-clamp-1 w-full transition-colors duration-500">{card.name}</h3>
                <p className="text-sm text-gray-900 group-hover:text-white/80 font-medium line-clamp-1 w-full transition-colors duration-500">{card.title}</p>
              </CardContent>
            </CardUI>
          </Link>
        </div>
      ))}
    </div>
  );
}
