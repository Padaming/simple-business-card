import Link from 'next/link';
import { JsonCardRepository } from '@/infrastructure/repositories/JsonCardRepository';
import { ListCardsUseCase } from '@/domain/use-cases/ListCards';
import { Button } from '@/presentation/components/ui/button';
import { Card as CardUI, CardContent } from '@/presentation/components/ui/card';

export default async function HomePage() {
  const repository = new JsonCardRepository();
  const listCardsUseCase = new ListCardsUseCase(repository);
  const cards = await listCardsUseCase.execute();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <section className="bg-beige pt-24 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            打造您的<span className="text-accent">現代化</span>電子名片
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            簡約、專業、多樣化的風格選擇<br/>只需要幾分鐘，就能建立屬於您的個人品牌頁面，輕鬆分享給全世界
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/editor">
              <Button
                className="inline-flex items-center gap-2 px-10 py-5 border-2 border-[#D9CD90] bg-[#FCFAF2] text-gray-900 rounded-full hover:bg-[#D9CD90] hover:text-white transition-all text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 h-auto"
              >
                立即免費建立
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="container mx-auto px-4 md:px-8 py-16 max-w-6xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">精選名片範例</h2>
          <p className="text-gray-500">探索其他人如何展示他們的數位身分</p>
        </div>

        {cards.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {cards.slice(0, 3).map((card) => (
              <div key={card.slug} className="w-full min-w-0">
                <Link href={`/cards/${card.slug}`} className="group block h-full no-underline">
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
                      <h3 className="text-lg font-bold !text-gray-900 group-hover:!text-white mb-0 line-clamp-1 w-full transition-colors duration-500">{card.name}</h3>
                      <p className="text-sm text-gray-900 group-hover:text-white/80 font-medium line-clamp-1 w-full transition-colors duration-500">{card.title}</p>
                    </CardContent>
                  </CardUI>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
