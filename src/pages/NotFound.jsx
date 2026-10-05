import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="empty">

      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        The page you are looking for does not exist.
      </p>

      <Link
        className="primary-btn"
        to="/"
      >
        Go Home
      </Link>

    </div>
  );
}

export default NotFound;