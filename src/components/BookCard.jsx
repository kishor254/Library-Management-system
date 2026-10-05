import { Link } from "react-router-dom";
import BookStatus from "./BookStatus";

function BookCard({ book }) {
  return (
    <div className="book-card">

      <div className="book-icon">
        📖
      </div>

      <div className="book-content">

        <span className="category">
          {book.category}
        </span>

        <h3>{book.title}</h3>

        <p>
          By {book.author}
        </p>

        <p>
          Published: {book.year}
        </p>

        <BookStatus available={book.available} />

        <Link
          className="details-btn"
          to={`/book/${book.id}`}
        >
          View Details →
        </Link>

      </div>

    </div>
  );
}

export default BookCard;