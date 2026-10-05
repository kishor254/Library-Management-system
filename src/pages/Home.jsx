import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">

      <div>

        <span className="badge">
          SMART LIBRARY
        </span>

        <h1>
          Discover Your Next
          <br />
          <span>Great Book</span>
        </h1>

        <p>
          Search thousands of books, borrow your
          favorites and manage your reading journey
          from one place.
        </p>

        <div className="hero-buttons">

          <Link to="/books" className="primary-btn">
            Explore Books
          </Link>

          <Link to="/member" className="secondary-btn">
            Member Dashboard
          </Link>

        </div>

      </div>

      <div className="hero-book">
        📚
      </div>

    </section>
  );
}

export default Home;