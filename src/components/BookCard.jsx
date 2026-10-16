import { useState } from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryStoreContext";
import { useAuth } from "../context/AuthContext";

export default function BookCard({ book, onEdit, onDelete }) {
  const {
    borrowedBooks,
    holds,
    borrowBook,
    returnBook,
    renewBook,
    holdBook,
    cancelHold
  } = useLibrary();

  const { isAuthenticated, setIsLoginModalOpen } = useAuth();

  const [imgError, setImgError] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  const isBorrowedByMe = borrowedBooks.some((b) => b.id === book.id);
  const borrowedInfo = borrowedBooks.find((b) => b.id === book.id);
  const isHeldByMe = holds.some((h) => h.id === book.id);
  const holdInfo = holds.find((h) => h.id === book.id);

  // Fallback gradient based on book category
  const categoryGradients = {
    "Self-Help": "linear-gradient(135deg, #f59e0b, #d97706)",
    "Finance": "linear-gradient(135deg, #10b981, #059669)",
    "Programming": "linear-gradient(135deg, #6366f1, #4f46e5)",
    "Productivity": "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    "Fiction": "linear-gradient(135deg, #ec4899, #db2777)",
    "History": "linear-gradient(135deg, #f97316, #ea580c)",
    "Business": "linear-gradient(135deg, #0ea5e9, #0284c7)",
    "Technology": "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    "Science": "linear-gradient(135deg, #06b6d4, #0891b2)",
    "Psychology": "linear-gradient(135deg, #a855f7, #7e22ce)"
  };

  const handleAction = async (fn, arg) => {
    // Auth Guard check (Requirement 4d)
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setActionInProgress(true);
    fn(arg);
    setTimeout(() => setActionInProgress(false), 200);
  };

  return (
    <article className="book-card" data-available={book.available}>
      <div className="card-top">
        <Link to={`/book/${book.id}`} className="cover-wrap">
          {!imgError && book.image ? (
            <img
              src={book.image}
              alt={book.title}
              loading="lazy"
              className="book-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="cover-fallback"
              style={{
                background:
                  categoryGradients[book.category] ||
                  "linear-gradient(135deg, #6366f1, #3b82f6)"
              }}
            >
              <span className="fallback-category">{book.category}</span>
              <span className="fallback-title">{book.title}</span>
              <span className="fallback-author">{book.author}</span>
            </div>
          )}

          {/* Status Badge Over Image */}
          <div className="card-badges-overlay">
            {book.available ? (
              <span className="status-badge badge-available">
                <span className="status-dot" /> Available
              </span>
            ) : isBorrowedByMe ? (
              <span className="status-badge badge-borrowed">
                <span className="status-dot" /> On Loan to You
              </span>
            ) : (
              <span className="status-badge badge-checked-out">
                <span className="status-dot" /> Checked Out
              </span>
            )}

            {isHeldByMe && (
              <span className="status-badge badge-hold">
                Hold #{holdInfo.queuePosition}
              </span>
            )}
          </div>
        </Link>
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <span className="category-pill">{book.category}</span>
          <div className="card-header-actions-right">
            <span className="rating-pill">★ {book.rating || "4.7"}</span>
            {/* CRUD Edit/Delete Trigger Buttons (Requirement 3c, 3d) */}
            {onEdit && (
              <button
                type="button"
                className="btn-card-crud edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(book);
                }}
                title="Edit Book Information (PATCH /books/:id)"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="btn-card-crud delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(book.id);
                }}
                title="Delete Book from Database (DELETE /books/:id)"
              >
                🗑
              </button>
            )}
          </div>
        </div>

        <h3 className="book-card-title">
          <Link to={`/book/${book.id}`} title={book.title}>
            {book.title}
          </Link>
        </h3>
        <p className="book-card-author">by {book.author}</p>

        {/* Dynamic Contextual Action Area */}
        <div className="card-actions">
          {book.available ? (
            <button
              type="button"
              className="btn btn-borrow"
              disabled={actionInProgress}
              onClick={() => handleAction(borrowBook, book.id)}
            >
              Borrow Book
            </button>
          ) : isBorrowedByMe ? (
            <div className="btn-group-horizontal">
              <button
                type="button"
                className="btn btn-return"
                disabled={actionInProgress}
                onClick={() => handleAction(returnBook, book.id)}
              >
                Return
              </button>
              <button
                type="button"
                className="btn btn-renew"
                disabled={actionInProgress || borrowedInfo?.renewals >= 2}
                onClick={() => handleAction(renewBook, book.id)}
                title={
                  borrowedInfo?.renewals >= 2
                    ? "Max 2 renewals reached"
                    : "Renew for +14 days"
                }
              >
                Renew ({borrowedInfo?.renewals || 0}/2)
              </button>
            </div>
          ) : isHeldByMe ? (
            <div className="btn-group-horizontal">
              <span className="held-indicator">In Queue (#{holdInfo?.queuePosition})</span>
              <button
                type="button"
                className="btn btn-cancel-hold"
                disabled={actionInProgress}
                onClick={() => handleAction(cancelHold, book.id)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-hold"
              disabled={actionInProgress}
              onClick={() => handleAction(holdBook, book.id)}
            >
              Place Hold
            </button>
          )}

          <Link to={`/book/${book.id}`} className="details-arrow-btn" title="View Book Details">
            <span>Details</span>
            <span className="arrow-icon">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
