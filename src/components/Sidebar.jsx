import { Link, NavLink } from "react-router-dom";
import { useLibrary } from "../context/LibraryStoreContext";

export default function Sidebar({ onOpenMemberModal }) {
  const {
    borrowedBooks,
    holds,
    readingHistory,
    member,
    activeStore,
    setActiveStore
  } = useLibrary();

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand-wrap">
        <Link to="/" className="sidebar-brand">
          <span className="brand-logo-icon">📚</span>
          <div className="brand-texts">
            <span className="brand-title">BookNest<span>.</span></span>
            <span className="brand-tagline">STATE LAB · EXP 2</span>
          </div>
        </Link>
      </div>

      {/* Active State Manager Pill in Sidebar */}
      <div className="sidebar-store-pill">
        <div className="store-pill-header">
          <span className="pill-dot" />
          <span className="pill-label">ENGINE:</span>
          <strong>{activeStore === "redux" ? "Redux Toolkit" : "Zustand"}</strong>
        </div>
        <div className="store-pill-switch">
          <button
            type="button"
            className={`switch-chip ${activeStore === "redux" ? "chip-active" : ""}`}
            onClick={() => setActiveStore("redux")}
          >
            RTK
          </button>
          <button
            type="button"
            className={`switch-chip ${activeStore === "zustand" ? "chip-active" : ""}`}
            onClick={() => setActiveStore("zustand")}
          >
            Zustand
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-title">MAIN LIBRARY</div>
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/books" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">📖</span>
          <span className="nav-text">Explore Books</span>
        </NavLink>

        <NavLink to="/borrowed" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">🔖</span>
          <span className="nav-text">Borrowed Books</span>
          {borrowedBooks.length > 0 && (
            <span className="nav-counter-badge">{borrowedBooks.length}</span>
          )}
        </NavLink>

        <NavLink to="/holds" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">⏳</span>
          <span className="nav-text">Books on Hold</span>
          {holds.length > 0 && (
            <span className="nav-counter-badge hold-badge">{holds.length}</span>
          )}
        </NavLink>

        <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">📜</span>
          <span className="nav-text">Reading History</span>
          {readingHistory.length > 0 && (
            <span className="nav-counter-badge neutral-badge">{readingHistory.length}</span>
          )}
        </NavLink>

        <div className="nav-group-title">STATE &amp; LAB TOOLS</div>
        <NavLink to="/inspector" className={({ isActive }) => `nav-item inspector-link ${isActive ? "active" : ""}`}>
          <span className="nav-icon">⚡</span>
          <span className="nav-text">State &amp; Middleware</span>
          <span className="live-chip">LIVE</span>
        </NavLink>

        <div className="nav-group-title">ACCOUNT</div>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">👤</span>
          <span className="nav-text">Member Profile</span>
        </NavLink>
      </nav>

      {/* Member Mini Card at Bottom */}
      <div className="sidebar-member-footer" onClick={onOpenMemberModal} title="Click to edit profile">
        <div className="member-avatar">{member?.avatar || member?.name?.charAt(0) || "A"}</div>
        <div className="member-info">
          <strong>{member?.name || "Library Member"}</strong>
          <span>{member?.cardTier || "Gold Scholar"}</span>
        </div>
        <span className="edit-pencil-icon">✎</span>
      </div>
    </aside>
  );
}
