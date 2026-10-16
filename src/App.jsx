import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LibraryStoreProvider, useLibrary } from "./context/LibraryStoreContext";
import LoginModal from "./components/LoginModal";
import Toast from "./components/Toast";
import BookCard from "./components/BookCard";
import EmptyState from "./components/EmptyState";
import { CatalogSkeletonGrid } from "./components/LoadingSkeleton";
import BookDetail from "./pages/BookDetail";
import MemberProfile from "./pages/MemberProfile";

const MemberModal = lazy(() => import("./components/MemberModal"));
const BookCrudModal = lazy(() => import("./components/BookCrudModal"));
const TokenStudio = lazy(() => import("./components/TokenStudio"));
const DeploymentModal = lazy(() => import("./components/DeploymentModal"));

function MainLibraryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    activeStore,
    setActiveStore,
    books,
    borrowedBooks,
    holds,
    readingHistory,
    member: storeMember,
    loading,
    simulateAsyncLoad,
    resetLibrary,
    returnBook,
    renewBook,
    cancelHold,
    clearHistory,
    addBook,
    updateBook,
    deleteBook,
    fetchBooksFromApi
  } = useLibrary();

  const {
    isAuthenticated,
    member: authMember,
    logout,
    setIsLoginModalOpen
  } = useAuth();

  const activeMember = authMember || storeMember;

  // Check if viewing a single book details page (/book/:id) or profile page
  const isBookDetailRoute = location.pathname.startsWith("/book/");
  const isProfileRoute = location.pathname === "/profile";

  // Active Tab state synced with URL pathname
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.replace(/^\//, "");
    if (["books", "borrowed", "holds", "history", "auth"].includes(path)) {
      return path;
    }
    return "books";
  });

  // Sync activeTab whenever route/pathname changes
  useEffect(() => {
    const cleanPath = location.pathname.replace(/^\//, "");
    if (["books", "borrowed", "holds", "history", "auth"].includes(cleanPath)) {
      setActiveTab(cleanPath);
    } else if (cleanPath === "" || cleanPath === "home") {
      setActiveTab("books");
    } else if (cleanPath === "login") {
      setIsLoginModalOpen(true);
    }
  }, [location.pathname, setIsLoginModalOpen]);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // CRUD Modal State
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // History action filter
  const [historyFilter, setHistoryFilter] = useState("all");

  // Toast feedback message
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab === "books" ? "" : tab}`);
  };

  // Extract unique categories from books list
  const categories = ["All", ...new Set(books.map((b) => b.category))];

  // Filtered books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || book.category === selectedCategory;

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && book.available) ||
      (availabilityFilter === "borrowed" && !book.available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const filteredHistory = readingHistory.filter((item) => {
    if (historyFilter === "all") return true;
    return item.action.toLowerCase().includes(historyFilter.toLowerCase());
  });

  const availableCount = books.filter((b) => b.available).length;
  const borrowQuotaPercent = Math.min(
    100,
    Math.round((borrowedBooks.length / (activeMember.maxLoans || 5)) * 100)
  );

  const storageKey =
    activeStore === "redux" ? "booknest_redux_state" : "booknest_zustand_state";

  // CRUD Handlers (Experiment 3)
  const handleOpenAddModal = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setBookToEdit(null);
    setIsCrudModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setBookToEdit(book);
    setIsCrudModalOpen(true);
  };

  const handleSaveBook = async (bookData) => {
    if (bookToEdit) {
      await updateBook(bookToEdit.id, bookData);
      showNotice(`✓ Updated book: "${bookData.title}" (PATCH /books/${bookToEdit.id})`);
    } else {
      const created = await addBook(bookData);
      showNotice(`✓ Created new book: "${created.title}" (POST /books)`);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    const book = books.find((b) => b.id === Number(id));
    if (window.confirm(`Are you sure you want to delete "${book?.title || id}" from the database?`)) {
      try {
        await deleteBook(id);
        showNotice(`✓ Deleted book #${id} (DELETE /books/${id})`);
      } catch (err) {
        showNotice(`⚠️ Delete failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="moderate-app-container">
      {/* 1. TOP HEADER & MULTI-EXPERIMENT CONTROLS */}
      <header className="moderate-header">
        <div
          className="header-brand-section"
          onClick={() => switchTab("books")}
          style={{ cursor: "pointer" }}
          title="Return to Books Catalog"
        >
          <div className="brand-logo-badge">📚</div>
          <div>
            <h1 className="header-title">
              BookNest<span>.</span>
            </h1>
            <span className="header-tagline">DIGITAL LIBRARY SYSTEM</span>
          </div>
        </div>

        {/* Global Store Switcher (Redux Toolkit vs Zustand) */}
        <div className="store-switcher-box" role="group" aria-label="Active Store">
          <span className="switcher-label">Store:</span>
          <button
            type="button"
            className={`switcher-pill ${activeStore === "redux" ? "active-redux" : ""}`}
            onClick={() => setActiveStore("redux")}
            title="Redux Toolkit Store"
          >
            <span className="dot redux-dot" />
            <span>Redux Toolkit</span>
          </button>
          <button
            type="button"
            className={`switcher-pill ${activeStore === "zustand" ? "active-zustand" : ""}`}
            onClick={() => setActiveStore("zustand")}
            title="Zustand Store"
          >
            <span className="dot zustand-dot" />
            <span>Zustand</span>
          </button>
        </div>

        {/* Auth Quick Status & Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="auth-header-pill logged-in">
              <span className="auth-dot" />
              <span>{activeMember.name || "Member"}</span>
              <button
                type="button"
                className="btn-header-logout"
                onClick={logout}
                title="Sign out of account"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="action-btn auth-login-btn"
              onClick={() => setIsLoginModalOpen(true)}
              title="Sign in or become a member"
            >
              🔑 Member Sign In
            </button>
          )}

          <div className="storage-chip" title={`Synchronized with LocalStorage key: ${storageKey}`}>
            <span className="pulse-indicator" />
            <span><code>{storageKey}</code></span>
          </div>

          <button
            type="button"
            className="action-btn async-btn"
            disabled={loading}
            onClick={() => simulateAsyncLoad(900)}
            title="Test loading states and shimmer skeletons"
          >
            {loading ? "Loading..." : "⏳ Test Loading"}
          </button>

          <button
            type="button"
            className="action-btn reset-btn"
            onClick={() => {
              if (window.confirm("Reset library state to clean initial defaults (28 books)?")) {
                resetLibrary();
              }
            }}
            title="Restore catalog defaults"
          >
            🔄 Reset
          </button>

          <button
            type="button"
            className="action-btn deploy-hub-btn"
            onClick={() => setIsDeployModalOpen(true)}
            title="View Deployment, PWA & Production Specs (Experiment 3)"
          >
            🚀 Deploy Hub
          </button>
        </div>
      </header>

      {/* TOAST NOTIFICATION & ACTION FEEDBACK */}
      <Toast />
      {actionNotice && (
        <div className="action-success-toast" role="status">
          <span>{actionNotice}</span>
          <button type="button" onClick={() => setActionNotice(null)}>✕</button>
        </div>
      )}

      {/* 2. MEMBER INFO, QUOTA BAR & TABS (Hidden on dedicated Book Details and Profile pages) */}
      {!isBookDetailRoute && !isProfileRoute && (
        <>
          <section className="member-bar-card">
            <div
              className="member-avatar-wrap"
              onClick={() => {
                if (isAuthenticated) {
                  setIsMemberModalOpen(true);
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              title={isAuthenticated ? "Click to edit member" : "Click to login"}
            >
              <div className="member-avatar">
                {activeMember.avatar || activeMember.name?.charAt(0) || "A"}
              </div>
              <span className="avatar-edit-tag">✎</span>
            </div>

            <div className="member-info-col">
              <div className="member-name-row">
                <strong>{activeMember.name || "Alex Vance"}</strong>
                <span className="member-tier-badge">{activeMember.cardTier || "Gold Scholar"}</span>
                <span className="member-id-text">ID: {activeMember.membershipId || "BN-2026-9812"}</span>
              </div>
              <span className="member-email-text">{activeMember.email || "alex.vance@university.edu"}</span>
            </div>

            <div className="member-quota-col">
              <div className="quota-header">
                <span>BORROWING QUOTA</span>
                <strong>
                  {borrowedBooks.length} / {activeMember.maxLoans || 5} Books Used
                </strong>
              </div>
              <div className="quota-track">
                <div className="quota-fill" style={{ width: `${borrowQuotaPercent}%` }} />
              </div>
              <small className="quota-subtext">
                {(activeMember.maxLoans || 5) - borrowedBooks.length} available loans remaining
              </small>
            </div>

            <div className="member-actions-cluster">
              {isAuthenticated ? (
                <button
                  type="button"
                  className="btn-edit-member"
                  onClick={() => setIsMemberModalOpen(true)}
                >
                  ✎ Edit Member
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  🔑 Login to Borrow
                </button>
              )}
            </div>
          </section>

          {/* 3. KEY METRICS STATS CARDS */}
          <section className="stats-strip">
            <div className="stat-box" onClick={() => switchTab("books")}>
              <div className="stat-icon">📚</div>
              <div className="stat-meta">
                <span className="stat-label">TOTAL BOOKS</span>
                <strong className="stat-number">{books.length}</strong>
                <small>GET /books</small>
              </div>
            </div>

            <div className="stat-box" onClick={() => switchTab("books")}>
              <div className="stat-icon text-success">✅</div>
              <div className="stat-meta">
                <span className="stat-label">AVAILABLE NOW</span>
                <strong className="stat-number text-success">{availableCount}</strong>
                <small>Ready on shelf</small>
              </div>
            </div>

            <div className="stat-box" onClick={() => switchTab("borrowed")}>
              <div className="stat-icon text-primary">🔖</div>
              <div className="stat-meta">
                <span className="stat-label">BORROWED BOOKS</span>
                <strong className="stat-number text-primary">{borrowedBooks.length}</strong>
                <small>API Loans Active</small>
              </div>
            </div>

            <div className="stat-box" onClick={() => switchTab("holds")}>
              <div className="stat-icon text-warning">⏳</div>
              <div className="stat-meta">
                <span className="stat-label">BOOKS ON HOLD</span>
                <strong className="stat-number text-warning">{holds.length}</strong>
                <small>Reservation queue</small>
              </div>
            </div>

            <div className="stat-box" onClick={() => switchTab("auth")}>
              <div className="stat-icon text-accent">🔐</div>
              <div className="stat-meta">
                <span className="stat-label">AUTH &amp; TOKEN</span>
                <strong className="stat-number">
                  {isAuthenticated ? "Active" : "Guest"}
                </strong>
                <small>JWT Bearer</small>
              </div>
            </div>
          </section>

          {/* 4. MAIN NAVIGATION TABS */}
          <nav className="moderate-nav-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "books"}
              className={`tab-btn ${activeTab === "books" ? "active" : ""}`}
              onClick={() => switchTab("books")}
            >
              <span>📖 Books Catalog ({books.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "borrowed"}
              className={`tab-btn ${activeTab === "borrowed" ? "active" : ""}`}
              onClick={() => switchTab("borrowed")}
            >
              <span>🔖 Borrowed Books</span>
              {borrowedBooks.length > 0 && (
                <span className="tab-badge">{borrowedBooks.length}</span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "holds"}
              className={`tab-btn ${activeTab === "holds" ? "active" : ""}`}
              onClick={() => switchTab("holds")}
            >
              <span>⏳ Books on Hold</span>
              {holds.length > 0 && (
                <span className="tab-badge warning-badge">{holds.length}</span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "history"}
              className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
              onClick={() => switchTab("history")}
            >
              <span>📜 Reading History</span>
              {readingHistory.length > 0 && (
                <span className="tab-badge neutral-badge">{readingHistory.length}</span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "auth"}
              className={`tab-btn auth-tab ${activeTab === "auth" ? "active" : ""}`}
              onClick={() => switchTab("auth")}
            >
              <span>🔐 Security &amp; Token Studio</span>
            </button>
          </nav>
        </>
      )}

      {/* 5. TAB VIEW CONTENT */}
      <main className="tab-view-content">
        <Routes>
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/profile" element={<MemberProfile />} />
          <Route
            path="*"
            element={
              <>
                {/* TAB 1: BOOKS CATALOG & CRUD OPERATIONS (Experiment 3) */}
                {activeTab === "books" && (
          <div className="catalog-tab-view">
            {/* Search, Filter & CRUD Add Button Row */}
            <div className="catalog-search-row">
              <div className="search-field">
                <span className="search-symbol">🔍</span>
                <input
                  type="search"
                  placeholder="Search books by title, author, or category (GET /books)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-box"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn-clear-search"
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="status-select-wrap">
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="status-dropdown"
                >
                  <option value="all">Status: All Books ({books.length})</option>
                  <option value="available">Status: Available ({availableCount})</option>
                  <option value="borrowed">Status: Checked Out ({books.length - availableCount})</option>
                </select>
              </div>

              {/* Experiment 3b: POST Add New Book */}
              <button
                type="button"
                className="btn btn-add-book"
                onClick={handleOpenAddModal}
                title="Add a new book to the library catalog"
              >
                + Add New Book
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="categories-pill-bar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Results Summary */}
            <div className="catalog-results-header">
              <span>
                Showing <strong>{filteredBooks.length}</strong> of {books.length} volumes in catalog
              </span>
              <div className="catalog-header-actions">
                <button
                  type="button"
                  className="btn-refresh-catalog"
                  onClick={() => fetchBooksFromApi()}
                  title="Reload books catalog from API database"
                >
                  ↻ Refresh Catalog
                </button>
                {(searchQuery || selectedCategory !== "All" || availabilityFilter !== "all") && (
                  <button
                    type="button"
                    className="reset-filters-btn"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setAvailabilityFilter("all");
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Books Grid with Edit/Delete CRUD Controls / Loading Skeletons / Empty State */}
            {loading ? (
              <CatalogSkeletonGrid count={8} />
            ) : filteredBooks.length === 0 ? (
              <EmptyState
                type="search"
                title="No Matching Books Found"
                description={`No titles in the catalog matched "${searchQuery || selectedCategory}". Try adjusting your query.`}
                actionText="Show All Books"
                onActionClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setAvailabilityFilter("all");
                }}
              />
            ) : (
              <div className="books-grid">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteBook}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BORROWED BOOKS (Experiment 3e: Borrowing API records) */}
        {activeTab === "borrowed" && (
          <div className="borrowed-tab-view">
            <div className="view-intro-banner">
              <div>
                <h2>Your Borrowed Books ({borrowedBooks.length})</h2>
                <p>
                  Managed via API operations (<code>POST /borrowings</code> on check-out, <code>PATCH /borrowings/:id</code> on renewal, and <code>PATCH /books/:id</code> on return).
                </p>
              </div>
              <div className="quota-mini-badge">
                <span>{borrowedBooks.length} / {activeMember.maxLoans || 5} Loans</span>
              </div>
            </div>

            {borrowedBooks.length === 0 ? (
              <EmptyState
                type="borrowed"
                title="No Books Currently Borrowed"
                description="Your reading queue is clear! Explore our catalog to borrow books using protected API operations."
                actionText="Browse Books Catalog"
                onActionClick={() => switchTab("books")}
              />
            ) : (
              <div className="borrowed-cards-stack">
                {borrowedBooks.map((book) => (
                  <div key={book.id} className="borrowed-row-card">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="borrowed-row-thumb"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/100x140?text=Cover";
                      }}
                    />
                    <div className="borrowed-row-body">
                      <div className="borrowed-row-top">
                        <span className="category-pill">{book.category}</span>
                        <span className="due-pill">Due: {book.dueDate}</span>
                      </div>
                      <h3>{book.title}</h3>
                      <p className="borrowed-row-author">by {book.author}</p>

                      <div className="borrowed-meta-specs">
                        <div>
                          <span>Borrowed On:</span>
                          <strong>{book.borrowedOn || "Recent"}</strong>
                        </div>
                        <div>
                          <span>Renewals Used:</span>
                          <strong className={book.renewals >= 2 ? "text-danger" : ""}>
                            {book.renewals || 0} / 2
                          </strong>
                        </div>
                        <div>
                          <span>Status:</span>
                          <strong className="text-primary">Active Loan (API Synced)</strong>
                        </div>
                      </div>

                      <div className="borrowed-btn-row">
                        <button
                          type="button"
                          className="btn btn-return"
                          onClick={() => returnBook(book.id)}
                        >
                          Return Book (PATCH /books/{book.id})
                        </button>
                        <button
                          type="button"
                          className="btn btn-renew"
                          disabled={book.renewals >= 2}
                          onClick={() => renewBook(book.id)}
                          title={book.renewals >= 2 ? "Max 2 renewals reached" : "Extend loan by +14 days"}
                        >
                          {book.renewals >= 2 ? "Renewals Maxed (2/2)" : "Renew (+14 Days)"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKS ON HOLD */}
        {activeTab === "holds" && (
          <div className="holds-tab-view">
            <div className="view-intro-banner hold-intro">
              <div>
                <h2>Books on Hold ({holds.length})</h2>
                <p>
                  Reserved volumes currently checked out by other readers. As soon as the borrower returns the book, you will advance in line.
                </p>
              </div>
              <div className="quota-mini-badge">
                <span>{holds.length} Active Holds</span>
              </div>
            </div>

            {holds.length === 0 ? (
              <EmptyState
                type="holds"
                title="No Books Currently on Hold"
                description="You don't have any pending reservations. When a checked-out book catches your eye, click 'Place Hold' to join the reservation queue."
                actionText="Explore Available Books"
                onActionClick={() => switchTab("books")}
              />
            ) : (
              <div className="holds-list-stack">
                {holds.map((hold) => (
                  <div key={hold.id} className="hold-row-card">
                    <div className="hold-left">
                      <span className="queue-position-badge">Queue Position #{hold.queuePosition || 1}</span>
                      <h3>{hold.title}</h3>
                      <p>
                        <span>by {hold.author || "Acclaimed Author"}</span>
                        {hold.category && <span className="category-pill">{hold.category}</span>}
                        <span className="held-date-meta">Reserved: {hold.heldOn || "Recent"}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-cancel-hold"
                      onClick={() => cancelHold(hold.id)}
                    >
                      Cancel Hold
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: READING HISTORY */}
        {activeTab === "history" && (
          <div className="history-tab-view">
            <div className="history-intro-bar">
              <div>
                <h2>Reading History &amp; Activity Log ({readingHistory.length})</h2>
                <p>
                  Immutable chronological audit trail of all library transactions (POST, PATCH, DELETE, Loans).
                </p>
              </div>
              {readingHistory.length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (window.confirm("Clear all reading history records?")) {
                      clearHistory();
                    }
                  }}
                >
                  🗑 Clear History
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="history-filters-bar">
              <button
                type="button"
                className={`filter-chip ${historyFilter === "all" ? "active" : ""}`}
                onClick={() => setHistoryFilter("all")}
              >
                All ({readingHistory.length})
              </button>
              <button
                type="button"
                className={`filter-chip ${historyFilter === "borrowed" ? "active" : ""}`}
                onClick={() => setHistoryFilter("borrowed")}
              >
                Borrowed ({readingHistory.filter((h) => h.action.includes("Borrow")).length})
              </button>
              <button
                type="button"
                className={`filter-chip ${historyFilter === "returned" ? "active" : ""}`}
                onClick={() => setHistoryFilter("returned")}
              >
                Returned ({readingHistory.filter((h) => h.action.includes("Return")).length})
              </button>
              <button
                type="button"
                className={`filter-chip ${historyFilter === "crud" ? "active" : ""}`}
                onClick={() => setHistoryFilter("crud")}
              >
                CRUD Edits ({readingHistory.filter((h) => h.action.includes("Book")).length})
              </button>
            </div>

            {filteredHistory.length === 0 ? (
              <EmptyState
                type="history"
                title="No History Activity Found"
                description="Perform a borrow, return, renew, or CRUD action on the books catalog to log activity here."
                actionText="Explore Books Catalog"
                onActionClick={() => switchTab("books")}
              />
            ) : (
              <div className="history-timeline-stack">
                {filteredHistory.map((item, idx) => {
                  const slug = item.action.toLowerCase().replace(/[^a-z0-9]/g, "-");
                  return (
                    <div key={item.id || idx} className="history-item-row">
                      <div className={`history-dot ${slug}`} />
                      <div className="history-body">
                        <div className="history-top">
                          <strong>{item.title}</strong>
                          <span className={`action-badge ${slug}`}>{item.action}</span>
                        </div>
                        <div className="history-bottom">
                          <span>{item.date}</span>
                          {item.note && <span className="note-text">· {item.note}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SECURITY & TOKEN STUDIO */}
        {activeTab === "auth" && (
          <div className="auth-tab-view">
            <Suspense fallback={<CatalogSkeletonGrid count={2} />}>
              <TokenStudio />
            </Suspense>
          </div>
        )}
              </>
            }
          />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="moderate-footer">
        <span>BookNest Digital Library System · Automated Catalog &amp; Circulation</span>
        <span>Dual Store Architecture (Redux &amp; Zustand) · Secure Token-Based API Communications</span>
      </footer>

      {/* MODALS WITH LAZY LOADING & SUSPENSE */}
      <Suspense fallback={null}>
        <MemberModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
        />

        <BookCrudModal
          isOpen={isCrudModalOpen}
          onClose={() => setIsCrudModalOpen(false)}
          onSubmit={handleSaveBook}
          bookToEdit={bookToEdit}
        />

        <DeploymentModal
          isOpen={isDeployModalOpen}
          onClose={() => setIsDeployModalOpen(false)}
        />
      </Suspense>

      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LibraryStoreProvider>
        <MainLibraryPage />
      </LibraryStoreProvider>
    </AuthProvider>
  );
}