import { useState, useMemo } from "react";
import books from "../data/books";
import BookCard from "../components/BookCard";

function Books() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(books.map(b => b.category))
  ];

  const filteredBooks = useMemo(() => {

    return books.filter(book => {

      const text =
        `${book.title} ${book.author}`.toLowerCase();

      const matchesSearch =
        text.includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        book.category === category;

      return matchesSearch && matchesCategory;
    });

  }, [search, category]);

  return (
    <section>

      <div className="page-heading">
        <div>
          <span className="badge">
            COLLECTION
          </span>

          <h1>Explore Books</h1>
        </div>

        <p>
          {filteredBooks.length} books found
        </p>
      </div>

      <div className="filters">

        <input
          type="text"
          placeholder="🔍 Search title or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

      </div>

      {filteredBooks.length === 0 ? (

        <div className="empty">
          <h2>📚 No books found</h2>
          <p>Try another search.</p>
        </div>

      ) : (

        <div className="book-grid">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </div>

      )}

    </section>
  );
}

export default Books;