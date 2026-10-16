
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { member, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">B</span>
        BookNest
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/recommendations">Discover</Link>
      </nav>

      <div className="nav-account">
        {member ? (
          <>
            <span className="member-greeting">
              Hi, {member.name}
            </span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link className="login-button" to="/login">
            Member Login
          </Link>
        )}
      </div>
    </header>
  );
}