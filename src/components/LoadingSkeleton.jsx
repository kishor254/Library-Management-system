
export function BookCardSkeleton() {
  return (
    <div className="book-card-skeleton">
      <div className="skeleton-cover" />
      <div className="skeleton-info">
        <div className="skeleton-line tag" />
        <div className="skeleton-line title" />
        <div className="skeleton-line author" />
        <div className="skeleton-footer">
          <div className="skeleton-line pill" />
          <div className="skeleton-line btn" />
        </div>
      </div>
    </div>
  );
}

export function CatalogSkeletonGrid({ count = 8 }) {
  return (
    <div className="catalog-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ rows = 4 }) {
  return (
    <div className="table-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-avatar" />
          <div className="skeleton-text-group">
            <div className="skeleton-line wide" />
            <div className="skeleton-line narrow" />
          </div>
          <div className="skeleton-pill" />
        </div>
      ))}
    </div>
  );
}
