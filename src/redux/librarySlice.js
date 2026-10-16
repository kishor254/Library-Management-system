import { createSlice } from "@reduxjs/toolkit";
import {
  initialBooks,
  initialBorrowedBooks,
  initialHolds,
  initialHistory,
  initialMember
} from "../data/initialBooks";

// Helper to calculate due date 14 days from given date or now
function calculateDueDate(daysFromNow = 14) {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return date.toISOString().split("T")[0];
}

function formatCurrentDateTime() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }) + " " + now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Load persisted state from browser storage if present (Requirement e)
function loadPersistedState() {
  try {
    const raw = localStorage.getItem("booknest_redux_state");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.books && parsed.books.length >= 25 && parsed.borrowedBooks) {
        return {
          books: parsed.books,
          borrowedBooks: parsed.borrowedBooks,
          holds: parsed.holds || [],
          readingHistory: parsed.readingHistory || [],
          member: parsed.member || initialMember,
          loading: false,
          error: null
        };
      }
    }
  } catch (err) {
    console.warn("Could not parse persisted Redux state:", err);
  }

  return {
    books: initialBooks,
    borrowedBooks: initialBorrowedBooks,
    holds: initialHolds,
    readingHistory: initialHistory,
    member: initialMember,
    loading: false,
    error: null
  };
}

const initialState = loadPersistedState();

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    // Action c: Borrow book
    borrowBook: (state, action) => {
      const bookId = Number(action.payload);
      const book = state.books.find(b => b.id === bookId);

      if (!book) {
        state.error = `Book ID ${bookId} not found in catalog.`;
        return;
      }

      if (!book.available) {
        state.error = `"${book.title}" is already checked out.`;
        return;
      }

      if (state.borrowedBooks.length >= state.member.maxLoans) {
        state.error = `Borrow limit reached (${state.member.maxLoans} books max). Return a book first.`;
        return;
      }

      // Mark book as borrowed
      book.available = false;

      // Add to borrowed collection with 14 days due date
      const dueDate = calculateDueDate(14);
      state.borrowedBooks.push({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        image: book.image,
        borrowedOn: new Date().toISOString().split("T")[0],
        dueDate,
        renewals: 0,
        daysLeft: 14
      });

      // If user had a hold on this book, remove it from holds
      state.holds = state.holds.filter(h => h.id !== bookId);

      // Record activity into reading history
      state.readingHistory.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        bookId: book.id,
        title: book.title,
        action: "Borrowed",
        date: formatCurrentDateTime(),
        note: `Due by ${dueDate}`
      });

      state.error = null;
    },

    // Action c: Return book
    returnBook: (state, action) => {
      const bookId = Number(action.payload);
      const book = state.books.find(b => b.id === bookId);
      const isBorrowed = state.borrowedBooks.some(b => b.id === bookId);

      if (!book || !isBorrowed) {
        state.error = "This book is not currently in your borrowed list.";
        return;
      }

      // Restore book availability
      book.available = true;

      // Remove from borrowed books list
      state.borrowedBooks = state.borrowedBooks.filter(b => b.id !== bookId);

      // Record activity in reading history
      state.readingHistory.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        bookId: book.id,
        title: book.title,
        action: "Returned",
        date: formatCurrentDateTime(),
        note: "Returned in good condition"
      });

      state.error = null;
    },

    // Action c: Renew book (Enforces maximum 2 renewals per loan)
    renewBook: (state, action) => {
      const bookId = Number(action.payload);
      const borrowed = state.borrowedBooks.find(b => b.id === bookId);

      if (!borrowed) {
        state.error = "Cannot renew: Book is not currently borrowed.";
        return;
      }

      if (borrowed.renewals >= 2) {
        state.error = `Maximum renewal limit (2/2) reached for "${borrowed.title}".`;
        return;
      }

      // Extend due date by an additional 14 days
      const currentDue = new Date(borrowed.dueDate);
      const newDue = new Date(currentDue.getTime() + 14 * 24 * 60 * 60 * 1000);
      const formattedNewDue = newDue.toISOString().split("T")[0];

      borrowed.dueDate = formattedNewDue;
      borrowed.renewals += 1;
      borrowed.daysLeft += 14;

      // Record in reading history
      state.readingHistory.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        bookId: borrowed.id,
        title: borrowed.title,
        action: "Renewed",
        date: formatCurrentDateTime(),
        note: `Renewal #${borrowed.renewals}/2 - New due date: ${formattedNewDue}`
      });

      state.error = null;
    },

    // Action c: Place Hold on an unavailable book
    holdBook: (state, action) => {
      const bookId = Number(action.payload);
      const book = state.books.find(b => b.id === bookId);

      if (!book) {
        state.error = "Book not found.";
        return;
      }

      if (book.available) {
        state.error = `"${book.title}" is currently available on the shelf. You can borrow it directly!`;
        return;
      }

      if (state.holds.some(h => h.id === bookId)) {
        state.error = `You already have an active hold on "${book.title}".`;
        return;
      }

      const queuePosition = state.holds.length + 1;
      state.holds.push({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        heldOn: new Date().toISOString().split("T")[0],
        queuePosition
      });

      state.readingHistory.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        bookId: book.id,
        title: book.title,
        action: "Hold Placed",
        date: formatCurrentDateTime(),
        note: `Queue position #${queuePosition}`
      });

      state.error = null;
    },

    // Action c: Cancel hold
    cancelHold: (state, action) => {
      const bookId = Number(action.payload);
      const hold = state.holds.find(h => h.id === bookId);

      if (!hold) return;

      state.holds = state.holds.filter(h => h.id !== bookId);
      // Re-index remaining holds
      state.holds.forEach((h, idx) => {
        h.queuePosition = idx + 1;
      });

      state.readingHistory.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        bookId: hold.id,
        title: hold.title,
        action: "Hold Cancelled",
        date: formatCurrentDateTime(),
        note: "Hold removed by member"
      });
    },

    // Action b: Update Member Information
    updateMember: (state, action) => {
      state.member = {
        ...state.member,
        ...action.payload
      };

      state.readingHistory.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        bookId: null,
        title: "Member Profile",
        action: "Profile Updated",
        date: formatCurrentDateTime(),
        note: `Updated name to ${state.member.name}`
      });
    },

    // Clear reading history
    clearHistory: (state) => {
      state.readingHistory = [];
    },

    // Reset library state to initial defaults (clears local storage)
    resetLibrary: (state) => {
      state.books = initialBooks;
      state.borrowedBooks = initialBorrowedBooks;
      state.holds = initialHolds;
      state.readingHistory = initialHistory;
      state.member = initialMember;
      state.error = null;
      try {
        localStorage.removeItem("booknest_redux_state");
      } catch (e) {
        console.warn(e);
      }
    },

    // Experiment 3: CRUD Reducers (POST, PUT/PATCH, DELETE, GET)
    setBooks: (state, action) => {
      state.books = action.payload;
    },

    addBook: (state, action) => {
      const newBook = action.payload;
      state.books.unshift(newBook);
      state.readingHistory.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        bookId: newBook.id,
        title: newBook.title,
        action: "Book Added (POST)",
        date: formatCurrentDateTime(),
        note: `Added to ${newBook.category} category`
      });
      state.error = null;
    },

    updateBook: (state, action) => {
      const { id, ...updates } = action.payload;
      const bookId = Number(id);
      const book = state.books.find(b => b.id === bookId);
      if (book) {
        Object.assign(book, updates);

        // Sync with borrowed list if currently borrowed
        const borrowed = state.borrowedBooks.find(b => b.id === bookId);
        if (borrowed) Object.assign(borrowed, updates);

        state.readingHistory.unshift({
          id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          bookId,
          title: book.title,
          action: "Book Updated (PATCH)",
          date: formatCurrentDateTime(),
          note: `Updated details via API`
        });
      }
      state.error = null;
    },

    deleteBook: (state, action) => {
      const bookId = Number(action.payload);
      const target = state.books.find(b => b.id === bookId);
      state.books = state.books.filter(b => b.id !== bookId);
      state.borrowedBooks = state.borrowedBooks.filter(b => b.id !== bookId);
      state.holds = state.holds.filter(h => h.id !== bookId);

      state.readingHistory.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        bookId,
        title: target?.title || `Book #${bookId}`,
        action: "Book Deleted (DELETE)",
        date: formatCurrentDateTime(),
        note: "Removed from database"
      });
      state.error = null;
    },

    // Loading indicator for async simulated requests (Requirement f)
    setLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },

    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  borrowBook,
  returnBook,
  renewBook,
  holdBook,
  cancelHold,
  updateMember,
  clearHistory,
  resetLibrary,
  setLoading,
  clearError,
  setBooks,
  addBook,
  updateBook,
  deleteBook
} = librarySlice.actions;

export default librarySlice.reducer;