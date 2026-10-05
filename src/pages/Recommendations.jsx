import { Link } from "react-router-dom";

function Recommendations() {
  const books = [
    { id: 104, title: "Artificial Intelligence" },
    { id: 105, title: "Database Systems" },
    { id: 102, title: "Python Mastery" }
  ];

  return (
    <div>
      <h2>⭐ Recommended Books</h2>
      <p>Books selected for you based on your interests.</p>

      {books.map(book => (
        <div className="recommendation" key={book.id}>
          <div>
            <h3>📚 {book.title}</h3>
            <Link to={`/book/${book.id}`}>
              View Book →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Recommendations;