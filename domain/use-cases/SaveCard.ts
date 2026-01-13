import { Card } from '../entities/Card';
import { CardRepository } from './GetCard';

export class SaveCardUseCase {
  constructor(private repository: CardRepository) {}

  async execute(card: Card): Promise<void> {
    if (!card.slug) {
      throw new Error('Card slug is required');
    }
    await this.repository.saveCard(card);
  }
}
