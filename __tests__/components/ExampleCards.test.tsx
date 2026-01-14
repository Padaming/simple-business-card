/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { ExampleCards } from '@/app/components/ExampleCards';
import { Card } from '@/domain/entities/Card';
import '@testing-library/jest-dom';

describe('ExampleCards', () => {
  const mockCards: Card[] = [
    {
      slug: 'card-1',
      name: 'User 1',
      title: 'Developer',
      bio: 'Bio 1',
      avatar: '',
      links: [],
      theme: 'minimal'
    },
    {
      slug: 'card-2',
      name: 'User 2',
      title: 'Designer',
      bio: 'Bio 2',
      avatar: '',
      links: [],
      theme: 'gradient'
    },
    {
        slug: 'card-3',
        name: 'User 3',
        title: 'Manager',
        bio: 'Bio 3',
        avatar: '',
        links: [],
        theme: 'minimal'
    }
  ];

  it('renders a flex row container on desktop', () => {
    render(<ExampleCards cards={mockCards} />);
    const container = screen.getByTestId('example-cards-container');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('md:flex-row');
    expect(container).toHaveClass('gap-6');
  });

  it('renders text with gray-900 color', () => {
    render(<ExampleCards cards={mockCards} />);
    const cardTitle = screen.getByText('Developer');
    expect(cardTitle).toHaveClass('text-gray-900');
  });

  it('renders 3 cards when provided', () => {
    render(<ExampleCards cards={mockCards} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });
  
  it('renders empty state when no cards', () => {
      render(<ExampleCards cards={[]} />);
      expect(screen.getByText('目前還沒有名片')).toBeInTheDocument();
  });
});
