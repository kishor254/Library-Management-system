import { useState } from "react";
import { useLibrary } from "../context/LibraryStoreContext";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import { CatalogSkeletonGrid } from "../components/LoadingSkeleton";

export default function BooksCatalog() {
  const { books, loading } = useLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("all"); // 'all', 'available', 'borrowed'

  // Extract unique categories
  const categories = ["All", ...new Set(books.map(b => b.category))];

  // Filter books by search, category, and availability
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || book.category === selectedCategory;

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && book.available) ||
      (availabilityFilter === "borrowed" && !book.available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setAvailabilityFilter("all");
  };

  return (
    <div className="page-container catalog-page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">LIBRARY CATALOG</span>
          <h1>Explore the Collection</h1>
          <p className="page-description">
            Search timeless titles, filter by category or shelf availability, and borrow or reserve with instant state synchronization.
          </p>
        </div>
        <div className="catalog-meta-badge">
          <span>{books.length} Books Registered</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <section className="catalog-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            placeholder="Search books by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="catalog-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Status: All Books</option>
            <option value="available">Status: Available Now</option>
            <option value="borrowed">Status: Checked Out</option>
          </select>
        </div>
      </section>

      {/* Category Pills */}
      <section className="category-scroll-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Results Header */}
      <div className="results-count-bar">
        <span>Showing <strong>{filteredBooks.length}</strong> of {books.length} books</span>
        {(searchQuery || selectedCategory !== "All" || availabilityFilter !== "all") && (
          <button
            type="button"
            className="btn-text-reset"
            onClick={handleResetFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Books Grid or Skeleton or Empty State (Requirement f) */}
      {loading ? (
        <CatalogSkeletonGrid count={8} />
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          type="search"
          title="No Matching Books Found"
          description={`No books in the catalog matched "${searchQuery || selectedCategory}". Try adjusting your query or resetting filters.`}
          actionText="Reset All Filters"
          onActionClick={handleResetFilters}
        />
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
