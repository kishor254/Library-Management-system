
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">YOUR DIGITAL LIBRARY</span>

          <h1>
            Every great idea
            <span> starts with a book.</span>
          </h1>

          <p>
            Explore a world of knowledge, find your next favourite read,
            and manage your library experience in one place.
          </p>

          <div className="hero-actions">
            <Link to="/books" className="primary-button">
              Explore the Library →
            </Link>

            <Link to="/discover" className="secondary-button">
              Discover Reads
            </Link>
          </div>

          <div className="hero-note">
            ✦ Learn something new every day.
          </div>
        </div>

        <div className="hero-art">
          <div className="floating-label">YOUR NEXT CHAPTER</div>

          <div className="book-stack">
            <div className="book book-one">
              <span>01 / LEARN</span>
              <strong>Think<br />Better.</strong>
              <small>Knowledge collection</small>
            </div>

            <div className="book book-two">
              <span>02 / GROW</span>
              <strong>Build<br />Your Future.</strong>
              <small>Ideas that last</small>
            </div>

            <div className="book book-three">
              <span>03 / DISCOVER</span>
              <strong>Explore<br />More.</strong>
              <small>Your next adventure</small>
            </div>
          </div>

          <div className="art-caption">READ · LEARN · REPEAT</div>
        </div>
      </section>

      <section className="home-features container">
        <div className="section-heading">
          <span className="eyebrow">MADE FOR CURIOUS MINDS</span>
          <h2>Your library, made simpler.</h2>
          <p>Everything you need to find your next great read.</p>
        </div>

        <div className="feature-grid">
          <Link to="/books" className="feature-card">
            <span className="feature-icon">⌕</span>
            <h3>Explore Books</h3>
            <p>Search titles, discover authors, and filter by category.</p>
            <span className="feature-link">Browse collection →</span>
          </Link>

          <Link to="/discover" className="feature-card">
            <span className="feature-icon">✧</span>
            <h3>Discover Reads</h3>
            <p>Find interesting books from our library collection.</p>
            <span className="feature-link">Discover books →</span>
          </Link>

          <Link to="/login" className="feature-card">
            <span className="feature-icon">◎</span>
            <h3>Member Login</h3>
            <p>Register or log in to access your member account.</p>
            <span className="feature-link">Access account →</span>
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <span>BOOKNEST</span>
        <p>A little reading can open a whole new world.</p>
      </footer>
    </main>
  );
}