import { Card } from '../entities/Card';

export interface CardRepository {
  getCard(slug: string): Promise<Card | null>;
  listCards(): Promise<Card[]>;
}

export class GetCardUseCase {
  constructor(private repository: CardRepository) {}

  async execute(slug: string): Promise<Card | null> {
    return await this.repository.getCard(slug);
  }
}
