import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useLibrary } from "../context/LibraryStoreContext";
import { useAuth } from "../context/AuthContext";

export default function BookDetail() {
  const params = useParams();
  const location = useLocation();
  const {
    books,
    borrowedBooks,
    holds,
    readingHistory,
    borrowBook,
    returnBook,
    renewBook,
    holdBook,
    cancelHold
  } = useLibrary();

  const { isAuthenticated, setIsLoginModalOpen } = useAuth();

  const [imgError, setImgError] = useState(false);
  const rawId = params.id || location.pathname.match(/\/book\/([^/?#]+)/)?.[1];
  const bookId = Number(rawId);
  const book = books.find(b => b.id === bookId || String(b.id) === String(rawId));

  if (!book) {
    return (
      <div className="page-container book-detail-page">
        <div className="not-found-box">
          <div className="not-found-icon">📚</div>
          <h2>Book Not Found</h2>
          <p>We could not locate book #{rawId || params.id} in the current catalog.</p>
          <Link to="/books" className="btn btn-primary">
            ← Back to Books Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isBorrowedByMe = borrowedBooks.some(b => b.id === book.id);
  const borrowedInfo = borrowedBooks.find(b => b.id === book.id);
  const isHeldByMe = holds.some(h => h.id === book.id);
  const holdInfo = holds.find(h => h.id === book.id);

  // Filter history events related to this specific book
  const bookHistory = readingHistory.filter(h => h.bookId === book.id);

  const [detailNotice, setDetailNotice] = useState(null);

  const showDetailNotice = (msg) => {
    setDetailNotice(msg);
    setTimeout(() => setDetailNotice(null), 4000);
  };

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      await borrowBook(book.id);
      showDetailNotice(`✓ Successfully borrowed "${book.title}"! Due date in 14 days.`);
    } catch (err) {
      showDetailNotice(`⚠️ Could not borrow: ${err.message}`);
    }
  };

  const handleReturn = async () => {
    try {
      await returnBook(book.id);
      showDetailNotice(`✓ Returned "${book.title}" to library shelf.`);
    } catch (err) {
      showDetailNotice(`⚠️ Could not return: ${err.message}`);
    }
  };

  const handleRenew = async () => {
    try {
      await renewBook(book.id);
      showDetailNotice(`✓ Renewed loan for "${book.title}" (+14 days).`);
    } catch (err) {
      showDetailNotice(`⚠️ Could not renew: ${err.message}`);
    }
  };

  const handleHold = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      await holdBook(book.id);
      showDetailNotice(`✓ Added to reservation hold queue for "${book.title}".`);
    } catch (err) {
      showDetailNotice(`⚠️ Could not place hold: ${err.message}`);
    }
  };

  const handleCancelHold = async () => {
    try {
      await cancelHold(book.id);
      showDetailNotice(`✓ Cancelled hold reservation for "${book.title}".`);
    } catch (err) {
      showDetailNotice(`⚠️ Could not cancel hold: ${err.message}`);
    }
  };

  return (
    <div className="page-container book-detail-page">
      {/* Toast Notice inside Book Details */}
      {detailNotice && (
        <div className="action-success-toast" role="status" style={{ marginBottom: "16px" }}>
          <span>{detailNotice}</span>
          <button type="button" onClick={() => setDetailNotice(null)}>✕</button>
        </div>
      )}

      <div className="detail-breadcrumb">
        <Link to="/books">← Back to Catalog</Link>
        <span>/</span>
        <span className="current-crumb">{book.title}</span>
      </div>

      <div className="book-detail-grid">
        {/* Left Column: Cover & Quick Stats */}
        <div className="detail-cover-pane">
          {!imgError && book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="detail-large-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="detail-fallback-cover">
              <span>{book.category}</span>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          )}

          <div className="detail-quick-specs">
            <div className="spec-item">
              <span>RATING</span>
              <strong>★ {book.rating || "4.8"} / 5.0</strong>
            </div>
            <div className="spec-item">
              <span>YEAR</span>
              <strong>{book.year || "2020"}</strong>
            </div>
            <div className="spec-item">
              <span>PAGES</span>
              <strong>{book.pages || "320"}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="detail-info-pane">
          <div className="detail-header-tags">
            <span className="category-pill">{book.category}</span>
            {book.available ? (
              <span className="status-badge badge-available">
                <span className="status-dot" /> Available to Borrow
              </span>
            ) : isBorrowedByMe ? (
              <span className="status-badge badge-borrowed">
                <span className="status-dot" /> On Loan to You
              </span>
            ) : (
              <span className="status-badge badge-checked-out">
                <span className="status-dot" /> Currently Checked Out
              </span>
            )}
            {isHeldByMe && (
              <span className="status-badge badge-hold">
                Hold Position #{holdInfo.queuePosition}
              </span>
            )}
          </div>

          <h1 className="detail-book-title">{book.title}</h1>
          <p className="detail-author">Written by <strong>{book.author}</strong></p>

          <div className="detail-card-panel">
            <h3>About This Edition</h3>
            <p className="detail-description">{book.description}</p>

            <div className="detail-specs-table">
              <div className="spec-row">
                <span>Publisher:</span>
                <strong>{book.publisher || "Acclaimed Publishing"}</strong>
              </div>
              <div className="spec-row">
                <span>ISBN:</span>
                <code>{book.isbn || "978-0000000000"}</code>
              </div>
              <div className="spec-row">
                <span>Loan Duration:</span>
                <strong>14 Days (Standard Academic Loan)</strong>
              </div>
              <div className="spec-row">
                <span>Max Renewals:</span>
                <strong>2 Times per Loan</strong>
              </div>
            </div>
          </div>

          {/* Action Callout Box */}
          <div className="detail-actions-box">
            <h4>Library Actions (Dispatches to Global Store)</h4>

            {book.available ? (
              <div className="action-row">
                <p>This volume is currently available on the shelf for immediate loan.</p>
                <button
                  type="button"
                  className="btn btn-lg btn-borrow"
                  onClick={handleBorrow}
                >
                  📖 Borrow This Book Now
                </button>
              </div>
            ) : isBorrowedByMe ? (
              <div className="action-row">
                <div className="loan-status-message">
                  <p>
                    You currently have this book checked out.
                    Due date: <strong>{borrowedInfo?.dueDate}</strong> ({borrowedInfo?.renewals || 0}/2 renewals used).
                  </p>
                </div>
                <div className="btn-group-horizontal">
                  <button
                    type="button"
                    className="btn btn-return"
                    onClick={handleReturn}
                  >
                    Return Book to Library
                  </button>
                  <button
                    type="button"
                    className="btn btn-renew"
                    disabled={borrowedInfo?.renewals >= 2}
                    onClick={handleRenew}
                  >
                    Renew Loan (+14 Days)
                  </button>
                </div>
              </div>
            ) : isHeldByMe ? (
              <div className="action-row">
                <div className="hold-status-message">
                  <p>
                    You have an active hold on this book (Queue Position #{holdInfo?.queuePosition}).
                    You will be notified as soon as it is returned.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-cancel-hold"
                  onClick={handleCancelHold}
                >
                  Cancel Hold Request
                </button>
              </div>
            ) : (
              <div className="action-row">
                <p>This book is currently checked out by another reader. You can reserve your spot in the hold queue.</p>
                <button
                  type="button"
                  className="btn btn-lg btn-hold"
                  onClick={handleHold}
                >
                  ⏳ Place Hold on This Book
                </button>
              </div>
            )}
          </div>

          {/* Activity History for This Specific Book */}
          {bookHistory.length > 0 && (
            <div className="book-activity-history">
              <h4>Activity Trail for "{book.title}"</h4>
              <div className="activity-mini-list">
                {bookHistory.map(h => (
                  <div key={h.id} className="activity-mini-item">
                    <span className={`action-badge ${h.action.toLowerCase().replace(/\s+/g, "-")}`}>
                      {h.action}
                    </span>
                    <span className="activity-mini-date">{h.date}</span>
                    {h.note && <small className="activity-mini-note">({h.note})</small>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
