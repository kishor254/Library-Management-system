import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import BorrowRequest from "./pages/BorrowRequest";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/Login";

import MemberDashboard from "./pages/MemberDashboard";
import BorrowedBooks from "./pages/BorrowedBooks";
import History from "./pages/History";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import "./App.css";


// Protected Route
function ProtectedRoute({ children }) {

  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}


// Error Boundary
class ErrorBoundary extends React.Component {

  state = {
    error: false
  };

  static getDerivedStateFromError() {
    return {
      error: true
    };
  }

  render() {

    if (this.state.error) {
      return (
        <div className="empty">
          <h2>Something went wrong!</h2>
          <p>Please refresh the application.</p>
        </div>
      );
    }

    return this.props.children;
  }
}


// Main App
function App() {

  return (

    <ErrorBoundary>

      <AuthProvider>

        <BrowserRouter>

          <Routes>

            {/* Common Layout */}

            <Route element={<Layout />}>

              {/* Public Routes */}

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/books"
                element={<Books />}
              />

              {/* Dynamic Book Route */}

              <Route
                path="/book/:id"
                element={<BookDetails />}
              />

              {/* Borrow Request */}

              <Route
                path="/borrow/:id"
                element={<BorrowRequest />}
              />

              {/* Confirmation */}

              <Route
                path="/confirmation"
                element={<Confirmation />}
              />

              {/* Login */}

              <Route
                path="/login"
                element={<Login />}
              />


              {/* Protected Member Dashboard */}

              <Route
                path="/member"
                element={
                  <ProtectedRoute>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              >

                {/* Nested Routes */}

                <Route
                  path="borrowed"
                  element={<BorrowedBooks />}
                />

                <Route
                  path="history"
                  element={<History />}
                />

                <Route
                  path="recommendations"
                  element={<Recommendations />}
                />

                <Route
                  path="profile"
                  element={<Profile />}
                />

              </Route>


              {/* Protected Borrowed Page */}

              <Route
                path="/borrowed"
                element={
                  <ProtectedRoute>
                    <BorrowedBooks />
                  </ProtectedRoute>
                }
              />


              {/* Protected History Page */}

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />


              {/* Protected Profile Page */}

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />


              {/* 404 Page */}

              <Route
                path="*"
                element={<NotFound />}
              />

            </Route>

          </Routes>

        </BrowserRouter>

      </AuthProvider>

    </ErrorBoundary>
  );
}

export default App;