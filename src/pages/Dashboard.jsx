import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryStoreContext";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";

export default function Dashboard({ onOpenMemberModal }) {
  const {
    books,
    borrowedBooks,
    holds,
    readingHistory,
    member,
    activeStore,
    returnBook,
    renewBook
  } = useLibrary();

  const availableBooks = books.filter(b => b.available);
  const featuredBooks = books.slice(0, 4);
  const recentHistory = readingHistory.slice(0, 5);

  const borrowQuotaPercent = Math.min(
    100,
    Math.round((borrowedBooks.length / (member.maxLoans || 5)) * 100)
  );

  return (
    <div className="page-container dashboard-page">
      {/* Hero Welcome Banner */}
      <section className="dashboard-hero">
        <div className="hero-text-side">
          <span className="hero-pill">GLOBAL STATE MANAGEMENT DASHBOARD</span>
          <h1>
            Welcome back, <span>{member?.name || "Scholar"}</span>.
          </h1>
          <p>
            Experience reactive state orchestration powered by{" "}
            <strong>{activeStore === "redux" ? "Redux Toolkit (RTK)" : "Zustand"}</strong>.
            Borrow books, renew loans, place holds, and inspect live middleware activity in real time.
          </p>

          <div className="hero-button-row">
            <Link to="/books" className="btn btn-primary">
              Explore Catalog ({books.length} Books) →
            </Link>
            <Link to="/inspector" className="btn btn-secondary">
              ⚡ Inspect Live Middleware
            </Link>
          </div>
        </div>

        <div className="hero-stat-card">
          <div className="hero-quota-header">
            <span>BORROWING QUOTA</span>
            <strong>{borrowedBooks.length} / {member?.maxLoans || 5} Books</strong>
          </div>
          <div className="quota-bar-track">
            <div
              className="quota-bar-fill"
              style={{ width: `${borrowQuotaPercent}%` }}
            />
          </div>
          <div className="quota-footer">
            <small>{(member?.maxLoans || 5) - borrowedBooks.length} loans remaining</small>
            <button type="button" className="edit-link-btn" onClick={onOpenMemberModal}>
              Edit Profile ↗
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Grid (Requirement b) */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL COLLECTION</span>
            <span className="metric-icon">📚</span>
          </div>
          <strong className="metric-value">{books.length}</strong>
          <span className="metric-sub">Cataloged volumes</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">AVAILABLE NOW</span>
            <span className="metric-icon">✅</span>
          </div>
          <strong className="metric-value text-success">{availableBooks.length}</strong>
          <span className="metric-sub">Ready on the shelf</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">CURRENTLY BORROWED</span>
            <span className="metric-icon">🔖</span>
          </div>
          <strong className="metric-value text-accent">{borrowedBooks.length}</strong>
          <span className="metric-sub">Active member loans</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">BOOKS ON HOLD</span>
            <span className="metric-icon">⏳</span>
          </div>
          <strong className="metric-value text-warning">{holds.length}</strong>
          <span className="metric-sub">Reservations in queue</span>
        </div>
      </section>

      {/* Architecture Lab Banner Box */}
      <section className="lab-info-box">
        <div className="info-box-left">
          <div className="engine-indicator">
            <span className={`engine-badge ${activeStore}`}>
              {activeStore === "redux" ? "Redux Toolkit Slice Active" : "Zustand Store Active"}
            </span>
          </div>
          <h3>Reactive Middleware &amp; Storage Architecture</h3>
          <p>
            Every action ({activeStore === "redux" ? "dispatch(borrowBook/returnBook/renewBook/holdBook)" : "store.borrowBook/returnBook/renewBook/holdBook"})
            is intercepted by custom middleware for latency tracking, formatted console auditing, and automatic synchronization with <code>localStorage</code>.
          </p>
        </div>
        <div className="info-box-actions">
          <Link to="/inspector" className="btn btn-outline-light">
            View Live Middleware Terminal →
          </Link>
        </div>
      </section>

      {/* Active Borrowed Books Preview */}
      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">ACTIVE LOANS</span>
            <h2>Your Borrowed Books ({borrowedBooks.length})</h2>
          </div>
          {borrowedBooks.length > 0 && (
            <Link to="/borrowed" className="view-all-link">
              View all borrowed books →
            </Link>
          )}
        </div>

        {borrowedBooks.length === 0 ? (
          <EmptyState
            type="borrowed"
            title="No Books Currently Borrowed"
            description="You don't have any books checked out right now. Browse our catalog to borrow your next read!"
            actionText="Browse Collection"
            actionLink="/books"
          />
        ) : (
          <div className="loans-preview-grid">
            {borrowedBooks.slice(0, 3).map((item) => (
              <div key={item.id} className="loan-preview-card">
                <img
                  src={item.image}
                  alt={item.title}
                  className="loan-thumb"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/80x110?text=Cover";
                  }}
                />
                <div className="loan-details">
                  <span className="category-pill">{item.category}</span>
                  <h4><Link to={`/book/${item.id}`}>{item.title}</Link></h4>
                  <p className="loan-author">by {item.author}</p>
                  <div className="loan-due-info">
                    <span>Due: <strong>{item.dueDate}</strong></span>
                    <span className="renewal-tag">Renewals: {item.renewals || 0}/2</span>
                  </div>
                  <div className="loan-actions-row">
                    <button
                      type="button"
                      className="btn btn-sm btn-return"
                      onClick={() => returnBook(item.id)}
                    >
                      Return
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-renew"
                      disabled={item.renewals >= 2}
                      onClick={() => renewBook(item.id)}
                    >
                      Renew
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Catalog Books Preview */}
      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">EXPLORE COLLECTION</span>
            <h2>Popular Books on the Shelves</h2>
          </div>
          <Link to="/books" className="view-all-link">
            Explore all {books.length} books →
          </Link>
        </div>

        <div className="books-grid">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Recent Activity Timeline Preview */}
      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">AUDIT TRAIL</span>
            <h2>Recent Reading History</h2>
          </div>
          {readingHistory.length > 0 && (
            <Link to="/history" className="view-all-link">
              View full activity log ({readingHistory.length}) →
            </Link>
          )}
        </div>

        {recentHistory.length === 0 ? (
          <EmptyState
            type="history"
            title="No Recent Activity"
            description="Borrow or return a book to generate activity in your reading history."
          />
        ) : (
          <div className="activity-timeline-card">
            {recentHistory.map((item, idx) => (
              <div key={item.id || idx} className="timeline-item">
                <div className={`timeline-dot ${item.action.toLowerCase().replace(/\s+/g, "-")}`} />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>{item.title}</strong>
                    <span className={`action-badge ${item.action.toLowerCase().replace(/\s+/g, "-")}`}>
                      {item.action}
                    </span>
                  </div>
                  <div className="timeline-meta">
                    <span className="timeline-time">{item.date}</span>
                    {item.note && <span className="timeline-note">· {item.note}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
