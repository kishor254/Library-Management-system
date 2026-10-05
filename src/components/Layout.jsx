import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Outlet />
      </main>

      <footer>
        <h3>📚 LibSphere</h3>
        <p>Smart Library Management System</p>
        <p>© 2026 Library System</p>
      </footer>
    </>
  );
}

export default Layout;