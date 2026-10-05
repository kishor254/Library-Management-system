import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        📚 LibSphere
      </div>

      <div className="nav-links">

        <NavLink to="/">
          Home
        </NavLink>

        <NavLink to="/books">
          Books
        </NavLink>

        <NavLink to="/member">
          Member
        </NavLink>

        <NavLink to="/member/borrowed">
          Borrowed
        </NavLink>

        <NavLink to="/member/history">
          History
        </NavLink>

        <NavLink to="/profile">
          Profile
        </NavLink>

      </div>

      <NavLink className="login-btn" to="/login">
        Login
      </NavLink>

    </nav>
  );
}

export default Navbar;