import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryStoreContext";

const MemberModal = lazy(() => import("../components/MemberModal"));

export default function MemberProfile() {
  const {
    member,
    borrowedBooks,
    holds,
    readingHistory,
    activeStore,
    returnBook,
    renewBook
  } = useLibrary();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const borrowQuotaPercent = Math.min(
    100,
    Math.round((borrowedBooks.length / (member.maxLoans || 5)) * 100)
  );

  return (
    <div className="page-container profile-page">
      <div className="detail-breadcrumb" style={{ marginBottom: "16px" }}>
        <Link to="/books">← Back to Catalog</Link>
        <span>/</span>
        <span className="current-crumb">Member Profile</span>
      </div>

      <div className="page-header">
        <div>
          <span className="section-eyebrow">PATRON ACCOUNT</span>
          <h1>Member Information</h1>
          <p className="page-description">
            View membership tier credentials, current borrow allowances, and edit member contact preferences stored in global state.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsEditModalOpen(true)}
        >
          ✎ Edit Member Details
        </button>
      </div>

      <div className="profile-layout-grid">
        {/* Left Column: Member ID Card */}
        <div className="member-id-card">
          <div className="id-card-shine" />
          <div className="id-card-header">
            <span className="id-brand">BOOKNEST LIBRARY</span>
            <span className="id-tier-pill">{member.cardTier || "Gold Scholar"}</span>
          </div>

          <div className="id-card-body">
            <div className="id-avatar-large">
              {member.avatar || member.name?.charAt(0) || "A"}
            </div>
            <div className="id-names">
              <h2>{member.name || "Alex Vance"}</h2>
              <p>{member.email || "alex.vance@university.edu"}</p>
            </div>
          </div>

          <div className="id-card-footer">
            <div className="id-field">
              <span>MEMBER ID</span>
              <strong>{member.membershipId || "BN-2026-9812"}</strong>
            </div>
            <div className="id-field">
              <span>ISSUED DATE</span>
              <strong>{member.joinedDate || "Jan 14, 2025"}</strong>
            </div>
            <div className="id-field">
              <span>STATE STORE</span>
              <strong>{activeStore.toUpperCase()}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & Quota */}
        <div className="member-stats-panel">
          <div className="stats-panel-box">
            <div className="box-header">
              <h3>Borrowing Allowance &amp; Quota</h3>
              <span className="quota-tag">
                {borrowedBooks.length} of {member.maxLoans || 5} Books Used
              </span>
            </div>

            <div className="quota-bar-track large">
              <div
                className="quota-bar-fill"
                style={{ width: `${borrowQuotaPercent}%` }}
              />
            </div>

            <div className="quota-footnotes">
              <small>
                {borrowedBooks.length >= (member.maxLoans || 5)
                  ? "Borrow quota fully utilized. Return a volume to check out more."
                  : `You may borrow ${(member.maxLoans || 5) - borrowedBooks.length} additional book(s).`}
              </small>
            </div>
          </div>

          <div className="profile-metrics-row">
            <div className="profile-metric-tile">
              <span>ACTIVE BORROWED</span>
              <strong>{borrowedBooks.length}</strong>
              <small>Volumes on loan</small>
            </div>
            <div className="profile-metric-tile">
              <span>ACTIVE HOLDS</span>
              <strong>{holds.length}</strong>
              <small>In reservation queue</small>
            </div>
            <div className="profile-metric-tile">
              <span>TOTAL ACTIONS</span>
              <strong>{readingHistory.length}</strong>
              <small>Logged in audit history</small>
            </div>
          </div>
        </div>
      </div>

      {/* Currently Borrowed Books Section */}
      <section className="profile-loans-section">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">CHECKED OUT VOLUMES</span>
            <h2>Books in Member's Possession ({borrowedBooks.length})</h2>
          </div>
          <Link to="/borrowed" className="view-all-link">Manage loans →</Link>
        </div>

        {borrowedBooks.length === 0 ? (
          <div className="profile-loans-empty">
            <p>No books currently on loan.</p>
            <Link to="/books" className="btn btn-sm btn-primary">Browse Collection</Link>
          </div>
        ) : (
          <div className="profile-loans-table">
            {borrowedBooks.map((b) => (
              <div key={b.id} className="profile-loan-row">
                <div className="loan-row-info">
                  <strong><Link to={`/book/${b.id}`}>{b.title}</Link></strong>
                  <span className="loan-row-author">by {b.author}</span>
                  <span className="loan-row-due">Due: {b.dueDate}</span>
                  <span className="loan-row-renewals">Renewals: {b.renewals || 0}/2</span>
                </div>
                <div className="loan-row-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-return"
                    onClick={() => returnBook(b.id)}
                  >
                    Return
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-renew"
                    disabled={b.renewals >= 2}
                    onClick={() => renewBook(b.id)}
                  >
                    Renew
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Member Modal for Editing Profile */}
      <Suspense fallback={null}>
        <MemberModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Suspense>
    </div>
  );
}
