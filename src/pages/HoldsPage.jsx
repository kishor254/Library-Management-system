import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryStoreContext";
import EmptyState from "../components/EmptyState";

export default function HoldsPage() {
  const { holds, cancelHold } = useLibrary();

  return (
    <div className="page-container holds-page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">RESERVATIONS &amp; WAITING LIST</span>
          <h1>Books on Hold</h1>
          <p className="page-description">
            Monitor books you have reserved that are currently checked out by other readers. As soon as a book is returned, you will advance in line.
          </p>
        </div>

        <div className="catalog-meta-badge">
          <span>{holds.length} Active Reservations</span>
        </div>
      </div>

      <div className="loan-rules-banner hold-banner">
        <span className="info-icon">⏳</span>
        <div className="rules-text">
          <strong>Hold System:</strong> Holds are prioritized in First-Come, First-Served order. When the borrower returns a reserved title, the system flags the hold as ready for pickup.
        </div>
      </div>

      {holds.length === 0 ? (
        <EmptyState
          type="holds"
          title="No Books Currently on Hold"
          description="You don't have any pending reservations. When a book is checked out, you can click 'Place Hold' on any book card to join the waiting queue."
          actionText="Explore Catalog"
          actionLink="/books"
        />
      ) : (
        <div className="holds-table-container">
          <div className="holds-card-list">
            {holds.map((hold) => (
              <div key={hold.id} className="hold-item-row">
                <div className="hold-main-info">
                  <span className="queue-badge">Queue Position #{hold.queuePosition || 1}</span>
                  <h3><Link to={`/book/${hold.id}`}>{hold.title}</Link></h3>
                  <p className="hold-meta">
                    <span>by {hold.author || "Acclaimed Author"}</span>
                    {hold.category && <span className="category-pill">{hold.category}</span>}
                    <span className="held-date">Reserved on: {hold.heldOn || "Recent"}</span>
                  </p>
                </div>

                <div className="hold-actions">
                  <button
                    type="button"
                    className="btn btn-cancel-hold"
                    onClick={() => cancelHold(hold.id)}
                  >
                    Cancel Hold
                  </button>
                  <Link to={`/book/${hold.id}`} className="btn btn-outline">
                    View Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
