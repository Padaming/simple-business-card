/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/app/page';

// Mock the repository and use case
const mockExecute = jest.fn();

jest.mock('@/infrastructure/repositories/JsonCardRepository', () => {
  return {
    JsonCardRepository: jest.fn().mockImplementation(() => ({})),
  };
});

jest.mock('@/domain/use-cases/ListCards', () => {
  return {
    ListCardsUseCase: jest.fn().mockImplementation(() => ({
      execute: mockExecute,
    })),
  };
});

// Mock next/link since it's used in the component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('HomePage', () => {
  beforeEach(() => {
    mockExecute.mockClear();
  });

  it('renders "no cards" section when there are no cards', async () => {
    mockExecute.mockResolvedValue([]);

    const jsx = await HomePage();
    render(jsx);

    expect(screen.getByText('目前還沒有名片')).toBeInTheDocument();
    expect(screen.getByText('成為第一個建立名片的人！')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '建立名片' })).toBeInTheDocument();
  });

  it('renders cards grid when cards exist', async () => {
    const mockCards = [
      {
        slug: 'card-1',
        name: 'Alice',
        title: 'Developer',
        avatar: 'https://example.com/alice.jpg',
        theme: 'minimal'
      },
      {
        slug: 'card-2',
        name: 'Bob',
        title: 'Designer',
        // No avatar to test default fruit/initial logic if handled by CardUI or page
        // page.tsx handles avatar fallback logic explicitly
        avatar: '', 
        theme: 'minimal'
      }
    ];
    mockExecute.mockResolvedValue(mockCards);

    const jsx = await HomePage();
    render(jsx);

    // Should not show "no cards" message
    expect(screen.queryByText('目前還沒有名片')).not.toBeInTheDocument();

    // Should show card content
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    
    // Check for images
    const images = screen.getAllByRole('img');
    // Alice has avatar, Bob doesn't. 
    // Bob's fallback is just a div with initial, not an img tag in page.tsx:
    /*
      {card.avatar ? (
          ... <img ... />
      ) : (
          ... {card.name.charAt(0)} ...
      )}
    */
    // So distinct images should be 1 (Alice)
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/alice.jpg');
    
    // Bob's initial should be visible
    expect(screen.getByText('B')).toBeVisible();
  });

  it('limits display to first 3 cards', async () => {
     const mockCards = Array.from({ length: 5 }, (_, i) => ({
        slug: `card-${i}`,
        name: `User ${i}`,
        title: `Title ${i}`,
        avatar: '',
        theme: 'minimal'
      }));
      mockExecute.mockResolvedValue(mockCards);

      const jsx = await HomePage();
      render(jsx);

      // We expect 3 cards
      // The name elements: User 0, User 1, User 2
      expect(screen.getByText('User 0')).toBeInTheDocument();
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 2')).toBeInTheDocument();
      
      // User 3 and User 4 should NOT be there
      expect(screen.queryByText('User 3')).not.toBeInTheDocument();
      expect(screen.queryByText('User 4')).not.toBeInTheDocument();
  });
});
