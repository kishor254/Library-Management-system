import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookCard from '../components/BookCard';
import { renderWithAllProviders } from './testUtils';

const mockBook = {
  id: 1,
  title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
  author: 'Robert C. Martin',
  category: 'Programming',
  rating: 4.8,
  available: true,
  image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=400&q=80'
};

describe('Experiment 1: BookCard Component Testing', () => {
  it('a) renders book title, author, category, and rating properly', () => {
    renderWithAllProviders(<BookCard book={mockBook} />);
    expect(screen.getByText(/Clean Code/i)).toBeInTheDocument();
    expect(screen.getByText(/by Robert C. Martin/i)).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText(/4.8/i)).toBeInTheDocument();
  });

  it('d) displays Available badge when book.available is true', () => {
    renderWithAllProviders(<BookCard book={mockBook} />);
    expect(screen.getByText(/Available/i)).toBeInTheDocument();
  });

  it('d) displays Checked Out badge when book.available is false and not borrowed by user', () => {
    const unavailableBook = { ...mockBook, id: 99, available: false };
    renderWithAllProviders(<BookCard book={unavailableBook} />);
    expect(screen.getByText(/Checked Out/i)).toBeInTheDocument();
  });

  it('c) displays Borrow Book action button for available books', () => {
    renderWithAllProviders(<BookCard book={mockBook} />);
    const borrowBtn = screen.getByRole('button', { name: /Borrow Book/i });
    expect(borrowBtn).toBeInTheDocument();
  });

  it('c) fires onEdit and onDelete handlers when action buttons clicked', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    renderWithAllProviders(
      <BookCard book={mockBook} onEdit={handleEdit} onDelete={handleDelete} />
    );

    const editBtn = screen.getByTitle(/Edit Book Information/i);
    const deleteBtn = screen.getByTitle(/Delete Book from Database/i);

    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(mockBook);

    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith(mockBook.id);
  });

  it('navigates to book details link with correct href', () => {
    renderWithAllProviders(<BookCard book={mockBook} />);
    const detailsLink = screen.getByTitle(/View Book Details/i);
    expect(detailsLink).toBeInTheDocument();
    expect(detailsLink).toHaveAttribute('href', '/book/1');
  });
});
