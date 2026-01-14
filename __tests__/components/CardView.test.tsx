/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CardView } from '../../presentation/components/CardView';
import { Card } from '../../domain/entities/Card';

const mockCard: Card = {
  slug: 'test-card',
  name: 'Test User',
  title: 'Test Title',
  company: 'Test Company',
  theme: 'minimal',
  layout: 'centered',
  contact: {
    email: 'test@example.com'
  },
  links: [],
  logo: undefined,
};

describe('CardView Component', () => {
  it('renders card details correctly', () => {
    render(<CardView card={mockCard} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('renders fruit avatar when no avatar image is provided', () => {
    render(<CardView card={mockCard} />); // mockCard has no avatar
    
    // The fruit avatar is rendered as text inside a div.
    // Since fruit consists of emojis, we can check that an img tag is NOT present.
    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  it('renders image avatar when provided', () => {
    const cardWithAvatar = { ...mockCard, avatar: 'http://example.com/avatar.jpg' };
    render(<CardView card={cardWithAvatar} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'http://example.com/avatar.jpg');
    expect(img).toHaveAttribute('alt', 'Test User');
  });

  it('renders large avatar when variant is full', () => {
    render(<CardView card={mockCard} variant="full" />);
    // Check for the larger text size class or structure change
    // Since we output class names, checking specific class might be brittle but effective here:
    const name = screen.getByText('Test User');
    expect(name).toHaveClass('md:text-6xl');
  });
});
