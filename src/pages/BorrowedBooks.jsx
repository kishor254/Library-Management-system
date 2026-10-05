import { useNavigate } from "react-router-dom";

function BorrowedBooks() {

  const navigate = useNavigate();

  const borrowed = [
    {
      id: 101,
      title: "React Advanced Guide",
      due: "15 Oct 2026"
    }
  ];

  return (
    <div>

      <h2>📚 Borrowed Books</h2>

      {borrowed.length === 0 ? (

        <div className="empty">
          No borrowed books
        </div>

      ) : (

        borrowed.map(book => (

          <div className="borrowed-card" key={book.id}>

            <div>
              <h3>{book.title}</h3>
              <p>Due: {book.due}</p>
            </div>

            <div>
              <button
                onClick={() =>
                  alert("Book renewed!")
                }
              >
                Renew
              </button>

              <button
                onClick={() =>
                  alert("Book returned!")
                }
              >
                Return
              </button>
            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default BorrowedBooks;