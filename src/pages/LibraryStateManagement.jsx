import { useEffect } from "react";
import { useLibraryStore } from "../store/libraryStore";

export default function LibraryStateManagement() {
  const {
    books,
    borrowedBooks,
    holds,
    readingHistory,
    member,
    loading,
    error,
    loadLibrary,
    borrowBook,
    returnBook,
    renewBook,
    holdBook
  } = useLibraryStore();

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  if (loading) {
    return <p>Loading library information...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <main className="library-state">
      <h1>Library State Management</h1>

      <section>
        <h2>Member Information</h2>
        <p>Name: {member.name}</p>
        <p>Email: {member.email}</p>
      </section>

      <section>
        <h2>Available Books</h2>

        {books.filter(book => book.available).length === 0 ? (
          <p>No available books at the moment.</p>
        ) : (
          books.filter(book => book.available).map(book => (
            <article key={book.id} className="library-item">
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <button onClick={() => borrowBook(book.id)}>
                Borrow
              </button>
            </article>
          ))
        )}
      </section>

      <section>
        <h2>Borrowed Books</h2>

        {borrowedBooks.length === 0 ? (
          <p>You have not borrowed any books.</p>
        ) : (
          borrowedBooks.map(book => (
            <article key={book.id} className="library-item">
              <h3>{book.title}</h3>
              <p>Due date: {book.dueDate}</p>
              <p>Renewals: {book.renewals}/2</p>

              <button onClick={() => returnBook(book.id)}>
                Return
              </button>

              <button
                disabled={book.renewals >= 2}
                onClick={() => renewBook(book.id)}
              >
                Renew
              </button>
            </article>
          ))
        )}
      </section>

      <section>
        <h2>Books on Hold</h2>

        {holds.length === 0 ? (
          <p>No books are currently on hold.</p>
        ) : (
          holds.map(book => (
            <p key={book.id}>{book.title}</p>
          ))
        )}
      </section>

      <section>
        <h2>Reading History</h2>

        {readingHistory.length === 0 ? (
          <p>Your reading history is empty.</p>
        ) : (
          <ul>
            {readingHistory.map((item, index) => (
              <li key={index}>
                {item.title} — {item.action}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Unavailable Books</h2>

        {books.filter(book => !book.available).length === 0 ? (
          <p>All books are currently available.</p>
        ) : (
          books.filter(book => !book.available).map(book => (
            <article key={book.id} className="library-item">
              <p>{book.title}</p>
              <button onClick={() => holdBook(book.id)}>
                Place Hold
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}