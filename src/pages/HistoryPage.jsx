import { useState } from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryStoreContext";
import EmptyState from "../components/EmptyState";

export default function HistoryPage() {
  const { readingHistory, clearHistory } = useLibrary();
  const [filterAction, setFilterAction] = useState("all");

  const filteredHistory = readingHistory.filter(item => {
    if (filterAction === "all") return true;
    return item.action.toLowerCase().includes(filterAction.toLowerCase());
  });

  return (
    <div className="page-container history-page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">CHRONOLOGICAL AUDIT TRAIL</span>
          <h1>Reading History &amp; Actions</h1>
          <p className="page-description">
            Complete historical log of all library transactions. Every borrow, renewal, return, and hold request is immutably recorded in the global store.
          </p>
        </div>

        <div className="history-header-actions">
          {readingHistory.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your reading history?")) {
                  clearHistory();
                }
              }}
            >
              🗑 Clear History
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="history-filter-tabs">
        <button
          type="button"
          className={`filter-tab ${filterAction === "all" ? "active" : ""}`}
          onClick={() => setFilterAction("all")}
        >
          All Activity ({readingHistory.length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filterAction === "borrowed" ? "active" : ""}`}
          onClick={() => setFilterAction("borrowed")}
        >
          Borrowed ({readingHistory.filter(h => h.action === "Borrowed").length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filterAction === "returned" ? "active" : ""}`}
          onClick={() => setFilterAction("returned")}
        >
          Returned ({readingHistory.filter(h => h.action === "Returned").length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filterAction === "renewed" ? "active" : ""}`}
          onClick={() => setFilterAction("renewed")}
        >
          Renewed ({readingHistory.filter(h => h.action === "Renewed").length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filterAction === "hold" ? "active" : ""}`}
          onClick={() => setFilterAction("hold")}
        >
          Holds ({readingHistory.filter(h => h.action.includes("Hold")).length})
        </button>
      </div>

      {/* History Items or Empty State (Requirement f) */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          type="history"
          title="No Activity Found"
          description={
            filterAction === "all"
              ? "Your reading history is currently empty. As you borrow, return, renew, or hold books, actions will be logged here."
              : `No activity records found matching "${filterAction}".`
          }
          actionText={filterAction !== "all" ? "Show All Activity" : "Explore Books"}
          onActionClick={filterAction !== "all" ? () => setFilterAction("all") : undefined}
          actionLink={filterAction === "all" ? "/books" : undefined}
        />
      ) : (
        <div className="history-timeline-list">
          {filteredHistory.map((item, index) => {
            const actionSlug = item.action.toLowerCase().replace(/\s+/g, "-");

            return (
              <div key={item.id || index} className="history-card-item">
                <div className={`history-icon-badge ${actionSlug}`}>
                  {item.action === "Borrowed" && "📖"}
                  {item.action === "Returned" && "↩️"}
                  {item.action === "Renewed" && "🔄"}
                  {item.action.includes("Hold") && "⏳"}
                  {item.action.includes("Profile") && "👤"}
                </div>

                <div className="history-card-body">
                  <div className="history-card-top">
                    <h4>
                      {item.bookId ? (
                        <Link to={`/book/${item.bookId}`}>{item.title}</Link>
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </h4>
                    <span className={`action-badge ${actionSlug}`}>
                      {item.action}
                    </span>
                  </div>

                  <div className="history-card-bottom">
                    <span className="history-timestamp">{item.date}</span>
                    {item.note && <span className="history-note-text">· {item.note}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
