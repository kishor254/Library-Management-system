import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CatalogSkeletonGrid } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('Experiment 1: Borrowing, Member Profile, Loading & Error States', () => {
  it('e) renders CatalogSkeletonGrid with specified shimmer items during loading', () => {
    const { container } = render(<CatalogSkeletonGrid count={4} />);
    const skeletonCards = container.querySelectorAll('.book-card-skeleton');
    expect(skeletonCards.length).toBe(4);
  });

  it('e) displays EmptyState when no matching books are found', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        type="search"
        title="No Matching Books Found"
        description="Try searching with different keywords."
        actionText="Reset Search"
        onActionClick={handleAction}
      />
    );

    expect(screen.getByText('No Matching Books Found')).toBeInTheDocument();
    expect(screen.getByText('Try searching with different keywords.')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /Reset Search/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleAction).toHaveBeenCalled();
  });

  it('a) displays member information, tier badge, and borrowing quota', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Alex Vance/i)).toBeInTheDocument();
    expect(screen.getByText(/Gold Scholar/i)).toBeInTheDocument();
    expect(screen.getByText(/BORROWING QUOTA/i)).toBeInTheDocument();
  });

  it('c) navigates between Borrowed Books, Holds, and Reading History tabs', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Switch to Borrowed Books tab
    const borrowedTab = screen.getByRole('tab', { name: /Borrowed Books/i });
    fireEvent.click(borrowedTab);
    expect(screen.getByText(/Your Borrowed Books/i)).toBeInTheDocument();

    // Switch to Books on Hold tab
    const holdsTab = screen.getByRole('tab', { name: /Books on Hold/i });
    fireEvent.click(holdsTab);
    expect(screen.getByRole('heading', { name: /Books on Hold/i })).toBeInTheDocument();

    // Switch to Reading History tab
    const historyTab = screen.getByRole('tab', { name: /Reading History/i });
    fireEvent.click(historyTab);
    expect(screen.getByRole('heading', { name: /Reading History/i })).toBeInTheDocument();
  });
});
