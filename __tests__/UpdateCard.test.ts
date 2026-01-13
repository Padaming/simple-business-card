import { UpdateCardUseCase } from '@/domain/use-cases/UpdateCard';
import { Card } from '@/domain/entities/Card';

describe('UpdateCardUseCase', () => {
  const useCase = new UpdateCardUseCase();

  it('should update card fields', () => {
    const existingCard: Card = {
      slug: 'test-user',
      name: 'Test User',
      title: 'Old Title',
      theme: 'minimal',
    };

    const updates = {
      title: 'New Title',
      company: 'New Company',
    };

    const result = useCase.execute(existingCard, updates);

    expect(result.title).toBe('New Title');
    expect(result.company).toBe('New Company');
    expect(result.name).toBe('Test User');
    expect(result.slug).toBe('test-user');
  });

  it('should create new card when no existing card', () => {
    const updates: Partial<Card> = {
      slug: 'new-user',
      name: 'New User',
      title: 'New Title',
      theme: 'gradient',
    };

    const result = useCase.execute(null, updates);

    expect(result.slug).toBe('new-user');
    expect(result.name).toBe('New User');
    expect(result.title).toBe('New Title');
    expect(result.theme).toBe('gradient');
  });

  it('should preserve unchanged fields', () => {
    const existingCard: Card = {
      slug: 'test-user',
      name: 'Test User',
      title: 'Test Title',
      company: 'Test Company',
      bio: 'Test Bio',
      theme: 'minimal',
      accentColor: '#000000',
    };

    const updates = {
      title: 'Updated Title',
    };

    const result = useCase.execute(existingCard, updates);

    expect(result.title).toBe('Updated Title');
    expect(result.name).toBe('Test User');
    expect(result.company).toBe('Test Company');
    expect(result.bio).toBe('Test Bio');
    expect(result.accentColor).toBe('#000000');
  });

  it('should update nested contact information', () => {
    const existingCard: Card = {
      slug: 'test-user',
      name: 'Test User',
      title: 'Test Title',
      theme: 'minimal',
      contact: {
        email: 'old@example.com',
        phone: '+123',
      },
    };

    const updates = {
      contact: {
        email: 'new@example.com',
        phone: '+456',
        location: 'New Location',
      },
    };

    const result = useCase.execute(existingCard, updates);

    expect(result.contact?.email).toBe('new@example.com');
    expect(result.contact?.phone).toBe('+456');
    expect(result.contact?.location).toBe('New Location');
  });
});
