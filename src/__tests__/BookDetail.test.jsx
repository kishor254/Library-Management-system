import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookDetail from '../pages/BookDetail';
import { renderWithAllProviders } from './testUtils';

describe('Experiment 3: BookDetail Component Dynamic Routing', () => {
  it('renders book details for book #1 properly', () => {
    // Mock URL pathname to /book/1
    window.history.pushState({}, 'Test', '/book/1');

    renderWithAllProviders(<BookDetail />);

    // Should display Atomic Habits title in heading
    expect(screen.getByRole('heading', { level: 1, name: 'Atomic Habits' })).toBeInTheDocument();
    expect(screen.getByText(/James Clear/i)).toBeInTheDocument();
    expect(screen.getByText(/About This Edition/i)).toBeInTheDocument();
    expect(screen.getByText('← Back to Catalog')).toBeInTheDocument();
  });

  it('displays Available to Borrow badge and borrow action button', () => {
    window.history.pushState({}, 'Test', '/book/1');
    renderWithAllProviders(<BookDetail />);

    expect(screen.getByText(/Available to Borrow/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Borrow This Book Now/i })).toBeInTheDocument();
  });

  it('displays Not Found box when book ID is invalid', () => {
    window.history.pushState({}, 'Test', '/book/999999');
    renderWithAllProviders(<BookDetail />);

    expect(screen.getByText('Book Not Found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /← Back to Books Catalog/i })).toBeInTheDocument();
  });
});
