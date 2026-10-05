import {
  NavLink,
  Outlet
} from "react-router-dom";

function MemberDashboard() {

  return (
    <section>

      <div className="dashboard-header">

        <div>
          <span className="badge">
            MEMBER AREA
          </span>

          <h1>Welcome, Kishor 👋</h1>

          <p>
            Manage your library activity.
          </p>
        </div>

      </div>

      <div className="dashboard">

        <aside>

          <NavLink to="/member">
            📊 Overview
          </NavLink>

          <NavLink to="/member/borrowed">
            📚 Borrowed Books
          </NavLink>

          <NavLink to="/member/history">
            🕘 Reading History
          </NavLink>

          <NavLink to="/member/recommendations">
            ⭐ Recommendations
          </NavLink>

          <NavLink to="/member/profile">
            👤 Profile
          </NavLink>

        </aside>

        <div className="dashboard-content">
          <Outlet />
        </div>

      </div>

    </section>
  );
}

export default MemberDashboard;