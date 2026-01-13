'use server';

import { SaveCardUseCase } from '@/domain/use-cases/SaveCard';
import { JsonCardRepository } from '@/infrastructure/repositories/JsonCardRepository';
import { Card } from '@/domain/entities/Card';
import { revalidatePath } from 'next/cache';

export async function saveCardAction(card: Card) {
  const repository = new JsonCardRepository();
  const saveCardUseCase = new SaveCardUseCase(repository);

  try {
    await saveCardUseCase.execute(card);
    revalidatePath('/');
    revalidatePath(`/cards/${card.slug}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to save card:', error);
    return { success: false, error: 'Failed to save card' };
  }
}
