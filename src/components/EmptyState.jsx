import { Link } from "react-router-dom";

export default function EmptyState({
  type = "default",
  title = "No records found",
  description = "There are no items to display right now.",
  actionText,
  actionLink,
  onActionClick
}) {
  const icons = {
    books: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 7h8M8 11h5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    borrowed: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    holds: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    history: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    search: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="11" x2="14" y2="11" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    events: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    default: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  return (
    <div className="empty-state-card">
      <div className="empty-icon-wrap">
        {icons[type] || icons.default}
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="empty-action-btn">
          {actionText}
        </Link>
      )}
      {actionText && onActionClick && !actionLink && (
        <button type="button" onClick={onActionClick} className="empty-action-btn">
          {actionText}
        </button>
      )}
    </div>
  );
}
