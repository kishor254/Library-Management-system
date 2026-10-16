import { useState } from "react";

function BookCrudDialog({ onClose, onSubmit, bookToEdit }) {
  const isEditMode = Boolean(bookToEdit);

  const [title, setTitle] = useState(bookToEdit?.title || "");
  const [author, setAuthor] = useState(bookToEdit?.author || "");
  const [category, setCategory] = useState(bookToEdit?.category || "Programming");
  const [publisher, setPublisher] = useState(bookToEdit?.publisher || "Acclaimed Press");
  const [year, setYear] = useState(bookToEdit?.year || 2024);
  const [pages, setPages] = useState(bookToEdit?.pages || 320);
  const [rating, setRating] = useState(bookToEdit?.rating || 4.8);
  const [description, setDescription] = useState(bookToEdit?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("Title and Author are required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        author: author.trim(),
        category,
        publisher,
        year: Number(year),
        pages: Number(pages),
        rating: Number(rating),
        description: description.trim() || "An essential title in the library catalog."
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog crud-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-badge">
              CATALOG MANAGEMENT
            </span>
            <h2>{isEditMode ? `Edit Book: "${bookToEdit.title}"` : "Add New Book to Catalog"}</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="modal-error-alert" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row-two">
            <div className="form-group">
              <label htmlFor="crud-title">Book Title *</label>
              <input
                id="crud-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clean Architecture"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="crud-author">Author *</label>
              <input
                id="crud-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Robert C. Martin"
                required
              />
            </div>
          </div>

          <div className="form-row-three">
            <div className="form-group">
              <label htmlFor="crud-category">Category</label>
              <select
                id="crud-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Programming">Programming</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Productivity">Productivity</option>
                <option value="Psychology">Psychology</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="Business">Business</option>
                <option value="History">History</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="crud-year">Year</label>
              <input
                id="crud-year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="crud-rating">Rating (1-5)</label>
              <input
                id="crud-rating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label htmlFor="crud-publisher">Publisher</label>
              <input
                id="crud-publisher"
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g. O'Reilly Media"
              />
            </div>

            <div className="form-group">
              <label htmlFor="crud-pages">Page Count</label>
              <input
                id="crud-pages"
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="320"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="crud-desc">Summary Description</label>
            <textarea
              id="crud-desc"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key themes, ideas, and target audience..."
            />
          </div>

          <div className="api-operation-notice">
            <span>🛡️ Authorized Librarian Action:</span>
            <code>{isEditMode ? `Updating Record #${bookToEdit.id}` : "Creating New Inventory Record"}</code>
            <small>Session authenticated</small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Book Information"
                : "Add Book to Catalog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookCrudModal({ isOpen, onClose, onSubmit, bookToEdit }) {
  if (!isOpen) return null;

  return (
    <BookCrudDialog
      key={bookToEdit ? `edit-${bookToEdit.id}` : "new-book"}
      onClose={onClose}
      onSubmit={onSubmit}
      bookToEdit={bookToEdit}
    />
  );
}
