import { Card } from '../entities/Card';

export class UpdateCardUseCase {
  execute(existingCard: Card | null, updates: Partial<Card>): Card {
    const baseCard = existingCard || {
      slug: '',
      name: '',
      title: '',
      theme: 'minimal' as const,
    };

    return {
      ...baseCard,
      ...updates,
    };
  }
}
