
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3001";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchBook() {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API}/books/${id}`);

        if (active) setBook(response.data);
      } catch {
        if (active) {
          setError(
            "Could not load this book. Check that the API server is running."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchBook();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <main className="container status-message">Loading book details...</main>;
  }

  if (error) {
    return (
      <main className="container status-message">
        <h2>Unable to load book</h2>
        <p>{error}</p>
        <Link className="primary-button" to="/books">Try Again</Link>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="container status-message">
        <h2>Book not found</h2>
        <Link className="primary-button" to="/books">Back to Books</Link>
      </main>
    );
  }

  return (
    <main className="container details-page">
      <Link to="/books" className="back-link">← Back to library</Link>

      <section className="details-card">
        <div className="details-cover">
          <span>BOOKNEST</span>
          <div className="cover-symbol">▤</div>
          <small>{book.category || "Library Collection"}</small>
        </div>

        <div className="details-content">
          <span className="eyebrow">BOOK DETAILS</span>
          <h1>{book.title}</h1>
          <p className="details-author">Written by {book.author}</p>

          <p className="details-description">
            {book.description || "Discover this title from our library collection."}
          </p>

          <div className="details-info">
            <div>
              <span>Category</span>
              <strong>{book.category || "General"}</strong>
            </div>
            <div>
              <span>Rating</span>
              <strong>{book.rating ? `${book.rating}/5` : "Not rated"}</strong>
            </div>
            <div>
              <span>Publisher</span>
              <strong>{book.publisher || "Not specified"}</strong>
            </div>
            <div>
              <span>Published</span>
              <strong>{book.year || "Not specified"}</strong>
            </div>
          </div>

          <p className={book.available === false ? "unavailable" : "available"}>
            ● {book.available === false ? "Currently unavailable" : "Available in library"}
          </p>

          <Link to="/books" className="primary-button">
            Explore More Books
          </Link>
        </div>
      </section>
    </main>
  );
}