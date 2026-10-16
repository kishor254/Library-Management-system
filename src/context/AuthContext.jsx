/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getStoredToken,
  setStoredToken,
  loginMemberApi,
  registerMemberApi,
  forgotPasswordApi,
  decodeToken,
  simulateExpiredToken,
  simulateInvalidToken
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [member, setMember] = useState(() => {
    try {
      const raw = localStorage.getItem("booknest_auth_member");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [authError, setAuthError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync token state if modified in another window/tab or via storage events
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "booknest_auth_token") {
        setToken(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // a) Member login via API
  const login = useCallback(async (email, password) => {
    try {
      setAuthError(null);
      const res = await loginMemberApi(email, password);
      setToken(res.token);
      setMember(res.member);
      setIsLoginModalOpen(false);
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      setAuthError(msg);
      throw err;
    }
  }, []);

  // Register new member (Become a Member)
  const register = useCallback(async (memberData) => {
    try {
      setAuthError(null);
      const res = await registerMemberApi(memberData);
      setToken(res.token);
      setMember(res.member);
      setIsLoginModalOpen(false);
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      setAuthError(msg);
      throw err;
    }
  }, []);

  // Request password reset link
  const forgotPassword = useCallback(async (email) => {
    try {
      setAuthError(null);
      const res = await forgotPasswordApi(email);
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Password recovery failed";
      setAuthError(msg);
      throw err;
    }
  }, []);

  // e) Logout and token removal
  const logout = useCallback(() => {
    setStoredToken(null);
    localStorage.removeItem("booknest_auth_member");
    setToken(null);
    setMember(null);
    setAuthError(null);
  }, []);

  // f) Simulate Expired Token to test 401 handling
  const triggerExpiredToken = useCallback(() => {
    const expToken = simulateExpiredToken();
    setToken(expToken);
  }, []);

  // f) Simulate Invalid Token to test 401 handling
  const triggerInvalidToken = useCallback(() => {
    const invToken = simulateInvalidToken();
    setToken(invToken);
  }, []);

  const decoded = decodeToken(token);
  const isAuthenticated = Boolean(token && member && decoded);

  const value = {
    token,
    member,
    isAuthenticated,
    tokenPayload: decoded,
    authError,
    setAuthError,
    clearAuthError: () => setAuthError(null),
    login,
    register,
    forgotPassword,
    logout,
    triggerExpiredToken,
    triggerInvalidToken,
    isLoginModalOpen,
    setIsLoginModalOpen
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}