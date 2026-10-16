import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryStoreContext";
import EmptyState from "../components/EmptyState";

export default function BorrowedBooks() {
  const {
    borrowedBooks,
    returnBook,
    renewBook,
    member
  } = useLibrary();

  return (
    <div className="page-container borrowed-page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">YOUR ACTIVE READING</span>
          <h1>Borrowed Books</h1>
          <p className="page-description">
            Track books currently in your possession, view upcoming due dates, renew loans, or return items to circulation.
          </p>
        </div>

        <div className="borrowed-quota-card">
          <span>Active Loans</span>
          <strong>{borrowedBooks.length} / {member?.maxLoans || 5} Books</strong>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="loan-rules-banner">
        <span className="info-icon">💡</span>
        <div className="rules-text">
          <strong>Loan Policy:</strong> Standard loan period is 14 days. Each book can be renewed up to <strong>2 times</strong> (+14 days per renewal) provided no other reader has placed a hold on it.
        </div>
      </div>

      {/* Borrowed Books Grid or Empty State (Requirement f) */}
      {borrowedBooks.length === 0 ? (
        <EmptyState
          type="borrowed"
          title="No Books Currently Borrowed"
          description="Your reading queue is clear! Discover hundreds of books on self-help, finance, programming, fiction, and more."
          actionText="Explore Books Catalog"
          actionLink="/books"
        />
      ) : (
        <div className="borrowed-list-grid">
          {borrowedBooks.map((book) => {
            const renewalsUsed = book.renewals || 0;
            const isMaxRenewals = renewalsUsed >= 2;

            return (
              <article key={book.id} className="borrowed-item-card">
                <Link to={`/book/${book.id}`} className="borrowed-thumb-link">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="borrowed-thumb-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://placehold.co/120x170?text=Book";
                    }}
                  />
                </Link>

                <div className="borrowed-info-content">
                  <div className="borrowed-top-row">
                    <span className="category-pill">{book.category}</span>
                    <span className="due-date-pill">Due: {book.dueDate}</span>
                  </div>

                  <h3 className="borrowed-title">
                    <Link to={`/book/${book.id}`}>{book.title}</Link>
                  </h3>
                  <p className="borrowed-author">by {book.author}</p>

                  <div className="borrowed-specs-box">
                    <div className="spec-col">
                      <span>Borrowed On</span>
                      <strong>{book.borrowedOn || "Recent"}</strong>
                    </div>
                    <div className="spec-col">
                      <span>Renewals Used</span>
                      <strong>{renewalsUsed} / 2</strong>
                    </div>
                    <div className="spec-col">
                      <span>Status</span>
                      <strong className="status-on-loan">Active Loan</strong>
                    </div>
                  </div>

                  <div className="borrowed-action-buttons">
                    <button
                      type="button"
                      className="btn btn-return"
                      onClick={() => returnBook(book.id)}
                    >
                      Return Book
                    </button>
                    <button
                      type="button"
                      className="btn btn-renew"
                      disabled={isMaxRenewals}
                      onClick={() => renewBook(book.id)}
                      title={isMaxRenewals ? "Max renewals reached (2/2)" : "Extend loan by +14 days"}
                    >
                      {isMaxRenewals ? "Renewals Maxed (2/2)" : "Renew Loan (+14d)"}
                    </button>
                    <Link to={`/book/${book.id}`} className="btn btn-outline">
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}