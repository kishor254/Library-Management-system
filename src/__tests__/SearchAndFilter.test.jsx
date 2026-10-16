import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('Experiment 1: Book Search and Category Filtering', () => {
  it('b) filters books by search query in the search input', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText(/Search books by title, author, or category/i);
    expect(searchInput).toBeInTheDocument();

    // Type query "Pragmatic"
    fireEvent.change(searchInput, { target: { value: 'Pragmatic' } });

    // Should display Pragmatic Programmer and filter out unrelated books
    expect(screen.getByText(/The Pragmatic Programmer/i)).toBeInTheDocument();
    expect(screen.queryByText(/Atomic Habits/i)).not.toBeInTheDocument();
  });

  it('b) filters books by category pill click', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Click "Finance" category pill
    const financePill = screen.getByRole('button', { name: /^Finance$/i });
    fireEvent.click(financePill);

    // Shows finance titles
    expect(screen.getByText(/The Psychology of Money/i)).toBeInTheDocument();
    // Non-finance books are filtered
    expect(screen.queryByText(/Clean Code/i)).not.toBeInTheDocument();
  });

  it('d) filters books by availability status dropdown', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    const statusDropdown = screen.getByRole('combobox');
    expect(statusDropdown).toBeInTheDocument();

    // Select Available
    fireEvent.change(statusDropdown, { target: { value: 'available' } });
    expect(statusDropdown.value).toBe('available');
  });
});
