import Link from 'next/link';
import { JsonCardRepository } from '@/infrastructure/repositories/JsonCardRepository';
import { ListCardsUseCase } from '@/domain/use-cases/ListCards';
import { Card as CardUI, CardHeader, CardTitle, CardContent } from '@/presentation/components/ui/card';

const basePath = process.env.NODE_ENV === 'production' ? '/simple-business-card' : '';

export default async function HomePage() {
  const repository = new JsonCardRepository();
  const listCardsUseCase = new ListCardsUseCase(repository);
  const cards = await listCardsUseCase.execute();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">電子名片系統</h1>
        
        <div className="flex justify-center gap-4 mb-8">
          <Link
            href={`${basePath}/editor`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            建立新名片
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              <p className="text-lg mb-4">目前沒有名片</p>
              <p className="text-sm">請在 /data/cards/ 目錄下建立 JSON 檔案</p>
            </div>
          ) : (
            cards.map((card) => (
              <Link key={card.slug} href={`${basePath}/cards/${card.slug}`}>
                <CardUI className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    {card.avatar && (
                      <div className="mb-4 flex justify-center">
                        <img
                          src={card.avatar}
                          alt={card.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>
                    )}
                    <CardTitle className="text-center">{card.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">{card.title}</p>
                    {card.company && (
                      <p className="text-center text-gray-500 text-sm mt-1">{card.company}</p>
                    )}
                  </CardContent>
                </CardUI>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
