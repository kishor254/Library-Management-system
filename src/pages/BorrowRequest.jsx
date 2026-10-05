import {
  useParams,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import books from "../data/books";

function BorrowRequest() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [params] = useSearchParams();

  const hold = params.get("hold");

  const book = books.find(
    b => b.id === Number(id)
  );

  if (!book) {
    return <h2>Book not found</h2>;
  }

  const submitRequest = () => {

    navigate("/confirmation", {
      state: {
        book,
        type: hold ? "Hold" : "Borrow"
      }
    });

  };

  return (
    <div className="request-card">

      <span className="badge">
        {hold ? "HOLD REQUEST" : "BORROW REQUEST"}
      </span>

      <h1>{book.title}</h1>

      <p>
        Author: {book.author}
      </p>

      <p>
        {hold
          ? "This book is currently unavailable. You can place a hold request."
          : "Confirm your request to borrow this book."}
      </p>

      <button
        className="primary-btn"
        onClick={submitRequest}
      >
        Confirm {hold ? "Hold" : "Borrow"}
      </button>

      <button
        className="secondary-btn"
        onClick={() =>
          navigate(`/book/${book.id}`)
        }
      >
        Cancel
      </button>

    </div>
  );
}

export default BorrowRequest;