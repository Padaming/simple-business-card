import { SaveCardUseCase } from '../domain/use-cases/SaveCard';
import { Card } from '../domain/entities/Card';
import { CardRepository } from '../domain/use-cases/GetCard';

// Mock Repository
class MockCardRepository implements CardRepository {
  private cards: Map<string, Card> = new Map();

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

describe('SaveCardUseCase', () => {
  let saveCardUseCase: SaveCardUseCase;
  let mockRepository: MockCardRepository;

  beforeEach(() => {
    mockRepository = new MockCardRepository();
    saveCardUseCase = new SaveCardUseCase(mockRepository);
  });

  it('should save a valid card', async () => {
    const card: Card = {
      slug: 'test-card',
      name: 'Test User',
      title: 'Developer',
      theme: 'minimal',
    };

    await saveCardUseCase.execute(card);

    const savedCard = await mockRepository.getCard('test-card');
    expect(savedCard).toEqual(card);
  });

  it('should update an existing card', async () => {
    const initialCard: Card = {
      slug: 'test-card',
      name: 'Initial Name',
      title: 'Developer',
      theme: 'minimal',
    };
    await saveCardUseCase.execute(initialCard);

    const updatedCard: Card = {
      ...initialCard,
      name: 'Updated Name',
    };
    await saveCardUseCase.execute(updatedCard);

    const savedCard = await mockRepository.getCard('test-card');
    expect(savedCard?.name).toBe('Updated Name');
  });

  it('should throw error if slug is missing', async () => {
    const card: Card = {
      slug: '',
      name: 'No Slug',
      title: 'Developer',
      theme: 'minimal',
    };

    await expect(saveCardUseCase.execute(card)).rejects.toThrow('Card slug is required');
  });
});
