import { Card } from '../entities/Card';
import { CardRepository } from './GetCard';

export class ListCardsUseCase {
  constructor(private repository: CardRepository) {}

  async execute(): Promise<Card[]> {
    return await this.repository.listCards();
  }
}
