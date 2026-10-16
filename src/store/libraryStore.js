import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  initialBooks,
  initialBorrowedBooks,
  initialHolds,
  initialHistory,
  initialMember
} from "../data/initialBooks";
import { middlewareEventBus } from "../utils/middlewareEventBus";

// Helper utilities for date calculation & formatting
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

// Custom Zustand Middleware for action logging and monitoring (Requirement d)
const zustandMonitorMiddleware = (config) => (set, get, api) => {
  const loggedSet = (partial, replace, actionTag = "anonymousAction") => {
    const startTime = performance.now();
    const prevState = get();

    // Perform actual state update
    set(partial, replace, actionTag);

    const duration = (performance.now() - startTime).toFixed(2);
    const nextState = get();

    // Log to DevTools / Console
    console.groupCollapsed(
      `%c[Zustand Middleware] %c${actionTag} %c(${duration}ms)`,
      "color: #10b981; font-weight: bold;",
      "color: #f59e0b; font-weight: 600;",
      "color: #6366f1;"
    );
    console.log("%cPrevious State:", "color: #64748b;", prevState);
    console.log("%cNext State:", "color: #10b981; font-weight: bold;", nextState);
    console.groupEnd();

    // Broadcast to live on-screen Middleware Monitor HUD
    middlewareEventBus.emit({
      store: "Zustand",
      actionType: `zustand/${actionTag}`,
      actionName: actionTag,
      payload: typeof partial === "function" ? "State updater function" : partial,
      durationMs: duration,
      summary: summarizeZustandAction(actionTag, partial, nextState)
    });
  };

  return config(loggedSet, get, api);
};

function summarizeZustandAction(actionTag, partial, state) {
  switch (actionTag) {
    case "borrowBook":
      return `Zustand: Borrowed book. Total borrowed: ${state.borrowedBooks.length}`;
    case "returnBook":
      return `Zustand: Returned book. Total borrowed: ${state.borrowedBooks.length}`;
    case "renewBook":
      return `Zustand: Renewed book loan.`;
    case "holdBook":
      return `Zustand: Hold requested. Total holds: ${state.holds.length}`;
    case "cancelHold":
      return `Zustand: Hold cancelled.`;
    case "updateMember":
      return `Zustand: Member profile updated.`;
    case "clearHistory":
      return `Zustand: Reading history cleared.`;
    case "resetLibrary":
      return `Zustand: Store reset to seed data.`;
    case "loadLibrary":
      return `Zustand: Asynchronous catalog sync completed.`;
    default:
      return `Zustand action: ${actionTag}`;
  }
}

export const useLibraryStore = create(
  devtools(
    persist(
      zustandMonitorMiddleware((set, get) => ({
        books: initialBooks,
        borrowedBooks: initialBorrowedBooks,
        holds: initialHolds,
        readingHistory: initialHistory,
        member: initialMember,
        loading: false,
        error: null,

        // Asynchronous loading state simulation (Requirement f)
        loadLibrary: async () => {
          set({ loading: true, error: null }, false, "loadLibrary/start");
          try {
            await new Promise(resolve => setTimeout(resolve, 800));
            set({ loading: false }, false, "loadLibrary/success");
          } catch {
            set({ loading: false, error: "Unable to load library records." }, false, "loadLibrary/error");
          }
        },

        // Action c: Borrow book
        borrowBook: (id) => {
          const bookId = Number(id);
          const state = get();
          const book = state.books.find(item => item.id === bookId);

          if (!book) {
            set({ error: "Book not found." }, false, "borrowBook/notFound");
            return;
          }

          if (!book.available) {
            set({ error: `"${book.title}" is already checked out.` }, false, "borrowBook/unavailable");
            return;
          }

          if (state.borrowedBooks.length >= state.member.maxLoans) {
            set({ error: `Borrow limit reached (${state.member.maxLoans} books max).` }, false, "borrowBook/limitReached");
            return;
          }

          const dueDate = calculateDueDate(14);

          set(s => ({
            books: s.books.map(b => b.id === bookId ? { ...b, available: false } : b),
            borrowedBooks: [
              ...s.borrowedBooks,
              {
                id: book.id,
                title: book.title,
                author: book.author,
                category: book.category,
                image: book.image,
                borrowedOn: new Date().toISOString().split("T")[0],
                dueDate,
                renewals: 0,
                daysLeft: 14
              }
            ],
            holds: s.holds.filter(h => h.id !== bookId),
            readingHistory: [
              {
                id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                bookId: book.id,
                title: book.title,
                action: "Borrowed",
                date: formatCurrentDateTime(),
                note: `Due by ${dueDate}`
              },
              ...s.readingHistory
            ],
            error: null
          }), false, "borrowBook");
        },

        // Action c: Return book
        returnBook: (id) => {
          const bookId = Number(id);
          const state = get();
          const borrowed = state.borrowedBooks.find(b => b.id === bookId);

          if (!borrowed) {
            set({ error: "Book is not in your borrowed list." }, false, "returnBook/notBorrowed");
            return;
          }

          set(s => ({
            books: s.books.map(b => b.id === bookId ? { ...b, available: true } : b),
            borrowedBooks: s.borrowedBooks.filter(b => b.id !== bookId),
            readingHistory: [
              {
                id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                bookId: borrowed.id,
                title: borrowed.title,
                action: "Returned",
                date: formatCurrentDateTime(),
                note: "Returned to library shelf"
              },
              ...s.readingHistory
            ],
            error: null
          }), false, "returnBook");
        },

        // Action c: Renew book (Enforce max 2 renewals)
        renewBook: (id) => {
          const bookId = Number(id);
          const borrowed = get().borrowedBooks.find(item => item.id === bookId);

          if (!borrowed) {
            set({ error: "Cannot renew: Book is not borrowed." }, false, "renewBook/notBorrowed");
            return;
          }

          if (borrowed.renewals >= 2) {
            set({ error: `Renewal limit reached (2/2) for "${borrowed.title}".` }, false, "renewBook/limitReached");
            return;
          }

          const currentDue = new Date(borrowed.dueDate);
          const newDue = new Date(currentDue.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

          set(s => ({
            borrowedBooks: s.borrowedBooks.map(b =>
              b.id === bookId
                ? {
                    ...b,
                    dueDate: newDue,
                    renewals: b.renewals + 1,
                    daysLeft: b.daysLeft + 14
                  }
                : b
            ),
            readingHistory: [
              {
                id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                bookId: borrowed.id,
                title: borrowed.title,
                action: "Renewed",
                date: formatCurrentDateTime(),
                note: `Renewal #${borrowed.renewals + 1}/2 - Extended to ${newDue}`
              },
              ...s.readingHistory
            ],
            error: null
          }), false, "renewBook");
        },

        // Action c: Place Hold
        holdBook: (id) => {
          const bookId = Number(id);
          const state = get();
          const book = state.books.find(item => item.id === bookId);

          if (!book) return;

          if (book.available) {
            set({ error: `"${book.title}" is available. You can borrow it directly!` }, false, "holdBook/available");
            return;
          }

          if (state.holds.some(h => h.id === bookId)) {
            set({ error: `You already placed a hold on "${book.title}".` }, false, "holdBook/alreadyHeld");
            return;
          }

          const queuePosition = state.holds.length + 1;

          set(s => ({
            holds: [
              ...s.holds,
              {
                id: book.id,
                title: book.title,
                author: book.author,
                category: book.category,
                heldOn: new Date().toISOString().split("T")[0],
                queuePosition
              }
            ],
            readingHistory: [
              {
                id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                bookId: book.id,
                title: book.title,
                action: "Hold Placed",
                date: formatCurrentDateTime(),
                note: `Queue position #${queuePosition}`
              },
              ...s.readingHistory
            ],
            error: null
          }), false, "holdBook");
        },

        // Action c: Cancel Hold
        cancelHold: (id) => {
          const bookId = Number(id);
          const hold = get().holds.find(h => h.id === bookId);
          if (!hold) return;

          set(s => {
            const nextHolds = s.holds.filter(h => h.id !== bookId).map((h, i) => ({
              ...h,
              queuePosition: i + 1
            }));
            return {
              holds: nextHolds,
              readingHistory: [
                {
                  id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                  bookId: hold.id,
                  title: hold.title,
                  action: "Hold Cancelled",
                  date: formatCurrentDateTime(),
                  note: "Hold removed by member"
                },
                ...s.readingHistory
              ]
            };
          }, false, "cancelHold");
        },

        // Action b: Update Member Information
        updateMember: (memberData) => {
          set(s => ({
            member: { ...s.member, ...memberData },
            readingHistory: [
              {
                id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                bookId: null,
                title: "Member Profile",
                action: "Profile Updated",
                date: formatCurrentDateTime(),
                note: `Member name updated to ${memberData.name || s.member.name}`
              },
              ...s.readingHistory
            ]
          }), false, "updateMember");
        },

        clearHistory: () => {
          set({ readingHistory: [] }, false, "clearHistory");
        },

        resetLibrary: () => {
          try {
            localStorage.removeItem("booknest_zustand_state");
          } catch (e) {
            console.warn(e);
          }
          set({
            books: initialBooks,
            borrowedBooks: initialBorrowedBooks,
            holds: initialHolds,
            readingHistory: initialHistory,
            member: initialMember,
            error: null
          }, false, "resetLibrary");
        },

        // Experiment 3: CRUD Actions for Zustand
        setBooks: (newBooks) => {
          set({ books: newBooks }, false, "setBooks");
        },

        addBook: (newBook) => {
          set((s) => ({
            books: [newBook, ...s.books],
            readingHistory: [
              {
                id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                bookId: newBook.id,
                title: newBook.title,
                action: "Book Added (POST)",
                date: formatCurrentDateTime(),
                note: `Added to ${newBook.category} category`
              },
              ...s.readingHistory
            ],
            error: null
          }), false, "addBook");
        },

        updateBook: (id, updates) => {
          const bookId = Number(id);
          set((s) => ({
            books: s.books.map((b) => (b.id === bookId ? { ...b, ...updates } : b)),
            borrowedBooks: s.borrowedBooks.map((b) => (b.id === bookId ? { ...b, ...updates } : b)),
            readingHistory: [
              {
                id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                bookId,
                title: updates.title || "Book",
                action: "Book Updated (PATCH)",
                date: formatCurrentDateTime(),
                note: "Updated details via API"
              },
              ...s.readingHistory
            ],
            error: null
          }), false, "updateBook");
        },

        deleteBook: (id) => {
          const bookId = Number(id);
          const target = get().books.find((b) => b.id === bookId);
          set((s) => ({
            books: s.books.filter((b) => b.id !== bookId),
            borrowedBooks: s.borrowedBooks.filter((b) => b.id !== bookId),
            holds: s.holds.filter((h) => h.id !== bookId),
            readingHistory: [
              {
                id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                bookId,
                title: target?.title || `Book #${bookId}`,
                action: "Book Deleted (DELETE)",
                date: formatCurrentDateTime(),
                note: "Removed from database"
              },
              ...s.readingHistory
            ],
            error: null
          }), false, "deleteBook");
        },

        setLoading: (val) => {
          set({ loading: Boolean(val) }, false, "setLoading");
        },

        clearError: () => {
          set({ error: null }, false, "clearError");
        }
      })),
      {
        name: "booknest_zustand_state",
        onRehydrateStorage: () => (state) => {
          if (state && (!state.books || state.books.length < 25)) {
            state.books = initialBooks;
          }
        },
        partialize: (state) => ({
          books: state.books,
          borrowedBooks: state.borrowedBooks,
          holds: state.holds,
          readingHistory: state.readingHistory,
          member: state.member
        })
      }
    ),
    { name: "LibraryStore" }
  )
);