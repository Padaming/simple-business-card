import { Card } from '@/domain/entities/Card';
import { CardRepository } from '@/domain/use-cases/GetCard';
import * as fs from 'node:fs';
import * as path from 'node:path';

export class JsonCardRepository implements CardRepository {
  private dataDir: string;

  constructor(dataDir?: string) {
    this.dataDir = dataDir || path.join(process.cwd(), 'data', 'cards');
  }

  async getCard(slug: string): Promise<Card | null> {
    try {
      const filePath = path.join(this.dataDir, `${slug}.json`);
      
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const card: Card = JSON.parse(fileContent);
      
      return card;
    } catch (error) {
      console.error(`Error loading card ${slug}:`, error);
      return null;
    }
  }

  async listCards(): Promise<Card[]> {
    try {
      if (!fs.existsSync(this.dataDir)) {
        return [];
      }

      const files = fs.readdirSync(this.dataDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const cards: Card[] = [];
      
      for (const file of jsonFiles) {
        const filePath = path.join(this.dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const card: Card = JSON.parse(fileContent);
        cards.push(card);
      }
      
      return cards;
    } catch (error) {
      console.error('Error listing cards:', error);
      return [];
    }
  }

  async saveCard(card: Card): Promise<void> {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      const filePath = path.join(this.dataDir, `${card.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(card, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error saving card ${card.slug}:`, error);
      throw error;
    }
  }
}
