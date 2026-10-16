/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as rtkActions from "../redux/librarySlice";
import { useLibraryStore } from "../store/libraryStore";
import {
  getBooksApi,
  createBookApi,
  updateBookApi,
  deleteBookApi,
  createBorrowingApi,
  updateBorrowingApi,
  getStoredToken,
  isTokenExpired
} from "../services/api";

const LibraryStoreContext = createContext(null);

export function LibraryStoreProvider({ children }) {
  // Store selector: 'redux' or 'zustand' (Experiment 2)
  const [activeStore, setActiveStoreState] = useState(() => {
    return localStorage.getItem("booknest_active_store") || "redux";
  });

  const setActiveStore = (storeType) => {
    setActiveStoreState(storeType);
    localStorage.setItem("booknest_active_store", storeType);
  };

  // --- Redux State & Dispatch ---
  const reduxState = useSelector((state) => state.library);
  const dispatch = useDispatch();

  // --- Zustand State & Actions ---
  const zustandState = useLibraryStore();

  // Helper to enforce Experiment 4 Authentication Guard on protected actions
  const checkAuthGuard = useCallback(() => {
    const token = getStoredToken();
    if (!token) {
      const msg = "🔒 Authentication Required: Please login with a member token to perform library operations.";
      if (activeStore === "redux") {
        dispatch(rtkActions.clearError());
      }
      return { allowed: false, message: msg };
    }
    if (isTokenExpired(token)) {
      const msg = "⚠️ Session Expired: Your authentication token has expired. Please login again.";
      return { allowed: false, message: msg };
    }
    return { allowed: true };
  }, [activeStore, dispatch]);

  // Generic async simulation to demonstrate loading skeletons & spinners (Requirement 2f & 3f)
  const simulateAsyncLoad = useCallback(
    async (ms = 900) => {
      if (activeStore === "redux") {
        dispatch(rtkActions.setLoading(true));
        await new Promise((resolve) => setTimeout(resolve, ms));
        dispatch(rtkActions.setLoading(false));
      } else {
        zustandState.setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, ms));
        zustandState.setLoading(false);
      }
    },
    [activeStore, dispatch, zustandState]
  );

  // Experiment 3: a) Retrieve books using GET
  const fetchBooksFromApi = useCallback(
    async (params = {}) => {
      if (activeStore === "redux") {
        dispatch(rtkActions.setLoading(true));
      } else {
        zustandState.setLoading(true);
      }

      try {
        const fetchedBooks = await getBooksApi(params);
        if (activeStore === "redux") {
          dispatch(rtkActions.setBooks(fetchedBooks));
        } else {
          zustandState.setBooks(fetchedBooks);
        }
        return fetchedBooks;
      } catch (err) {
        console.error("API GET /books error:", err);
      } finally {
        if (activeStore === "redux") {
          dispatch(rtkActions.setLoading(false));
        } else {
          zustandState.setLoading(false);
        }
      }
    },
    [activeStore, dispatch, zustandState]
  );

  // Experiment 3: b) Add a new book using POST
  const addBook = useCallback(
    async (bookData) => {
      const auth = checkAuthGuard();
      if (!auth.allowed) {
        throw new Error(auth.message);
      }

      const newBook = await createBookApi(bookData);
      if (activeStore === "redux") {
        dispatch(rtkActions.addBook(newBook));
      } else {
        zustandState.addBook(newBook);
      }
      return newBook;
    },
    [activeStore, dispatch, zustandState, checkAuthGuard]
  );

  // Experiment 3: c) Update book information using PUT/PATCH
  const updateBook = useCallback(
    async (id, updates) => {
      const auth = checkAuthGuard();
      if (!auth.allowed) {
        throw new Error(auth.message);
      }

      const updated = await updateBookApi(id, updates);
      if (activeStore === "redux") {
        dispatch(rtkActions.updateBook({ id, ...updates }));
      } else {
        zustandState.updateBook(id, updates);
      }
      return updated;
    },
    [activeStore, dispatch, zustandState, checkAuthGuard]
  );

  // Experiment 3: d) Delete a book using DELETE
  const deleteBook = useCallback(
    async (id) => {
      const auth = checkAuthGuard();
      if (!auth.allowed) {
        throw new Error(auth.message);
      }

      await deleteBookApi(id);
      if (activeStore === "redux") {
        dispatch(rtkActions.deleteBook(id));
      } else {
        zustandState.deleteBook(id);
      }
    },
    [activeStore, dispatch, zustandState, checkAuthGuard]
  );

  // Unified Borrow Action (Syncs with Experiment 3 API & Store)
  const borrowBook = useCallback(
    async (id) => {
      const auth = checkAuthGuard();
      if (!auth.allowed) {
        if (activeStore === "redux") {
          dispatch(rtkActions.clearError());
        }
        throw new Error(auth.message);
      }

      const currentBooks = activeStore === "redux" ? reduxState.books : zustandState.books;
      const targetBook = currentBooks.find((b) => b.id === Number(id));

      if (targetBook) {
        try {
          await createBorrowingApi({
            bookId: targetBook.id,
            title: targetBook.title,
            borrowedOn: new Date().toISOString().split("T")[0]
          });
        } catch (e) {
          console.warn("API borrowing sync note:", e.message);
        }
      }

      if (activeStore === "redux") {
        dispatch(rtkActions.borrowBook(id));
      } else {
        zustandState.borrowBook(id);
      }
    },
    [activeStore, dispatch, reduxState, zustandState, checkAuthGuard]
  );

  // Unified Return Action (Syncs with Experiment 3 API & Store)
  const returnBook = useCallback(
    async (id) => {
      const auth = checkAuthGuard();
      if (!auth.allowed) {
        throw new Error(auth.message);
      }

      try {
        await updateBorrowingApi(id, { status: "returned" });
      } catch (e) {
        console.warn("API return sync note:", e.message);
      }

      if (activeStore === "redux") {
        dispatch(rtkActions.returnBook(id));
      } else {
        zustandState.returnBook(id);
      }
    },
    [activeStore, dispatch, zustandState, checkAuthGuard]
  );

  const renewBook = useCallback(
    async (id) => {
      const auth = checkAuthGuard();
      if (!auth.allowed) {
        throw new Error(auth.message);
      }

      if (activeStore === "redux") {
        dispatch(rtkActions.renewBook(id));
      } else {
        zustandState.renewBook(id);
      }
    },
    [activeStore, dispatch, zustandState, checkAuthGuard]
  );

  const holdBook = useCallback(
    (id) => {
      const auth = checkAuthGuard();
      if (!auth.allowed) {
        throw new Error(auth.message);
      }

      if (activeStore === "redux") {
        dispatch(rtkActions.holdBook(id));
      } else {
        zustandState.holdBook(id);
      }
    },
    [activeStore, dispatch, zustandState, checkAuthGuard]
  );

  const cancelHold = useCallback(
    (id) => {
      if (activeStore === "redux") {
        dispatch(rtkActions.cancelHold(id));
      } else {
        zustandState.cancelHold(id);
      }
    },
    [activeStore, dispatch, zustandState]
  );

  const updateMember = useCallback(
    (memberData) => {
      if (activeStore === "redux") {
        dispatch(rtkActions.updateMember(memberData));
      } else {
        zustandState.updateMember(memberData);
      }
    },
    [activeStore, dispatch, zustandState]
  );

  const clearHistory = useCallback(() => {
    if (activeStore === "redux") {
      dispatch(rtkActions.clearHistory());
    } else {
      zustandState.clearHistory();
    }
  }, [activeStore, dispatch, zustandState]);

  const resetLibrary = useCallback(() => {
    if (activeStore === "redux") {
      dispatch(rtkActions.resetLibrary());
    } else {
      zustandState.resetLibrary();
    }
  }, [activeStore, dispatch, zustandState]);

  const clearError = useCallback(() => {
    if (activeStore === "redux") {
      dispatch(rtkActions.clearError());
    } else {
      zustandState.clearError();
    }
  }, [activeStore, dispatch, zustandState]);

  // Current active store snapshot
  const current = activeStore === "redux" ? reduxState : zustandState;

  const contextValue = {
    activeStore,
    setActiveStore,
    books: current.books || [],
    borrowedBooks: current.borrowedBooks || [],
    holds: current.holds || [],
    readingHistory: current.readingHistory || [],
    member: current.member || {},
    loading: Boolean(current.loading),
    error: current.error,
    reduxState,
    zustandState,
    // Operations
    fetchBooksFromApi,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    renewBook,
    holdBook,
    cancelHold,
    updateMember,
    clearHistory,
    resetLibrary,
    simulateAsyncLoad,
    clearError
  };

  return (
    <LibraryStoreContext.Provider value={contextValue}>
      {children}
    </LibraryStoreContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryStoreContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryStoreProvider");
  }
  return context;
}
