import { ListCardsUseCase } from '@/domain/use-cases/ListCards';
import { Card } from '@/domain/entities/Card';
import { CardRepository } from '@/domain/use-cases/GetCard';

// Mock repository
class MockCardRepository implements CardRepository {
  private cards: Card[] = [];

  constructor(cards: Card[] = []) {
    this.cards = cards;
  }

  async getCard(slug: string): Promise<Card | null> {
    return this.cards.find(c => c.slug === slug) || null;
  }

  async listCards(): Promise<Card[]> {
    return this.cards;
  }

  async saveCard(card: Card): Promise<void> {
    this.cards.push(card);
  }
}

describe('ListCardsUseCase', () => {
  it('should return all cards', async () => {
    const mockCards: Card[] = [
      {
        slug: 'user-1',
        name: 'User 1',
        title: 'Title 1',
        theme: 'minimal',
      },
      {
        slug: 'user-2',
        name: 'User 2',
        title: 'Title 2',
        theme: 'gradient',
      },
    ];
    
    const repository = new MockCardRepository(mockCards);
    const useCase = new ListCardsUseCase(repository);
    
    const result = await useCase.execute();
    
    expect(result).toEqual(mockCards);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no cards exist', async () => {
    const repository = new MockCardRepository([]);
    const useCase = new ListCardsUseCase(repository);
    
    const result = await useCase.execute();
    
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
