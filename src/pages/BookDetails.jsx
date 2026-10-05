import {
  useParams,
  useNavigate
} from "react-router-dom";

import books from "../data/books";
import BookStatus from "../components/BookStatus";

function BookDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const book = books.find(
    b => b.id === Number(id)
  );

  if (!book) {
    return (
      <div className="empty">
        <h2>Book Not Found</h2>
        <button onClick={() => navigate("/books")}>
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <section className="details">

      <div className="details-icon">
        📖
      </div>

      <div>

        <span className="category">
          {book.category}
        </span>

        <h1>{book.title}</h1>

        <p className="author">
          Written by {book.author}
        </p>

        <div className="detail-info">

          <p>
            <b>Book ID:</b> {book.id}
          </p>

          <p>
            <b>Published:</b> {book.year}
          </p>

          <p>
            <b>Category:</b> {book.category}
          </p>

          <BookStatus
            available={book.available}
          />

        </div>

        <h3>Description</h3>

        <p>{book.description}</p>

        <div className="actions">

          {book.available ? (

            <button
              className="primary-btn"
              onClick={() =>
                navigate(`/borrow/${book.id}`)
              }
            >
              Borrow Book
            </button>

          ) : (

            <button
              className="primary-btn"
              onClick={() =>
                navigate(`/borrow/${book.id}?hold=true`)
              }
            >
              Place Hold
            </button>

          )}

          <button
            className="secondary-btn"
            onClick={() => navigate("/books")}
          >
            ← Back
          </button>

        </div>

      </div>

    </section>
  );
}

export default BookDetails;