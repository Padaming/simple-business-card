import { GetCardUseCase } from '@/domain/use-cases/GetCard';
import { Card } from '@/domain/entities/Card';
import { CardRepository } from '@/domain/use-cases/GetCard';

// Mock repository
class MockCardRepository implements CardRepository {
  private cards: Map<string, Card> = new Map();

  constructor(cards: Card[] = []) {
    cards.forEach(card => this.cards.set(card.slug, card));
  }

  async getCard(slug: string): Promise<Card | null> {
    return this.cards.get(slug) || null;
  }

  async listCards(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }

  async saveCard(card: Card): Promise<void> {
    this.cards.set(card.slug, card);
  }
}

describe('GetCardUseCase', () => {
  it('should return a card when it exists', async () => {
    const mockCard: Card = {
      slug: 'test-user',
      name: 'Test User',
      title: 'Test Title',
      theme: 'minimal',
    };
    
    const repository = new MockCardRepository([mockCard]);
    const useCase = new GetCardUseCase(repository);
    
    const result = await useCase.execute('test-user');
    
    expect(result).toEqual(mockCard);
  });

  it('should return null when card does not exist', async () => {
    const repository = new MockCardRepository([]);
    const useCase = new GetCardUseCase(repository);
    
    const result = await useCase.execute('non-existent');
    
    expect(result).toBeNull();
  });

  it('should return correct card from multiple cards', async () => {
    const card1: Card = {
      slug: 'user-1',
      name: 'User 1',
      title: 'Title 1',
      theme: 'minimal',
    };
    const card2: Card = {
      slug: 'user-2',
      name: 'User 2',
      title: 'Title 2',
      theme: 'gradient',
    };
    
    const repository = new MockCardRepository([card1, card2]);
    const useCase = new GetCardUseCase(repository);
    
    const result = await useCase.execute('user-2');
    
    expect(result).toEqual(card2);
  });
});
