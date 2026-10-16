import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal() {
  const {
    login,
    register,
    forgotPassword,
    isLoginModalOpen,
    setIsLoginModalOpen,
    authError,
    clearAuthError
  } = useAuth();

  // 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState("login");

  // Login form state
  const [email, setEmail] = useState("alex.vance@university.edu");
  const [password, setPassword] = useState("password123");

  // Registration form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDepartment, setRegDepartment] = useState("Computer Science");
  const [regTier, setRegTier] = useState("Gold Scholar");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setIsLoginModalOpen(false);
    clearAuthError();
    setForgotSuccessMsg(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await login(email, password);
      handleClose();
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Please agree to the library borrowing guidelines to proceed.");
      return;
    }
    try {
      setIsLoading(true);
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        department: regDepartment,
        cardTier: regTier
      });
      handleClose();
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await forgotPassword(forgotEmail);
      setForgotSuccessMsg(res.message);
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("password123");
    clearAuthError();
  };

  return (
    <div className="modal-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="modal-dialog auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="auth-header-copy">
            <span className="auth-badge-kicker">MEMBER ACCESS</span>
            <h2 id="auth-modal-title">
              {authMode === "login" && "Member Sign In"}
              {authMode === "register" && "Become a Library Member"}
              {authMode === "forgot" && "Recover Account Password"}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="auth-mode-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={authMode === "login"}
            className={`auth-mode-tab ${authMode === "login" ? "active" : ""}`}
            onClick={() => {
              setAuthMode("login");
              clearAuthError();
              setForgotSuccessMsg(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={authMode === "register"}
            className={`auth-mode-tab ${authMode === "register" ? "active" : ""}`}
            onClick={() => {
              setAuthMode("register");
              clearAuthError();
              setForgotSuccessMsg(null);
            }}
          >
            Create Account
          </button>
        </div>

        {authError && (
          <div className="modal-error-alert" role="alert">
            <span>⚠️</span>
            <span>{authError}</span>
          </div>
        )}

        {forgotSuccessMsg && (
          <div className="modal-success-alert" role="status">
            <span>✅</span>
            <span>{forgotSuccessMsg}</span>
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="auth-email">University Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="label-with-action">
                <label htmlFor="auth-password">Password</label>
                <button
                  type="button"
                  className="link-btn-text"
                  onClick={() => {
                    setAuthMode("forgot");
                    setForgotEmail(email);
                    clearAuthError();
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="demo-accounts-pill-box">
              <span className="demo-label">Quick Sign-In Demo Accounts:</span>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="btn-demo-chip"
                  onClick={() => handleFillDemo("alex.vance@university.edu")}
                >
                  Alex Vance (Gold Scholar)
                </button>
                <button
                  type="button"
                  className="btn-demo-chip"
                  onClick={() => handleFillDemo("sarah.connor@university.edu")}
                >
                  Sarah Connor (Platinum Fellow)
                </button>
              </div>
            </div>

            <div className="modal-actions-stacked">
              <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In to Member Account"}
              </button>

              <div className="auth-footer-prompt">
                <span>New to BookNest Library? </span>
                <button
                  type="button"
                  className="link-highlight"
                  onClick={() => {
                    setAuthMode("register");
                    clearAuthError();
                  }}
                >
                  Become a Member
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. BECOME A MEMBER (REGISTER / CREATE ACCOUNT) MODE */}
        {authMode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="modal-form">
            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="reg-name">Full Name *</label>
                <input
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">University Email *</label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="jordan.lee@university.edu"
                  required
                />
              </div>
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="reg-password">Password (min 8 chars) *</label>
                <input
                  id="reg-password"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create secure password"
                  minLength={8}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-tier">Membership Tier</label>
                <select
                  id="reg-tier"
                  value={regTier}
                  onChange={(e) => setRegTier(e.target.value)}
                >
                  <option value="Standard Scholar">Standard Scholar (3 book limit)</option>
                  <option value="Gold Scholar">Gold Scholar (5 book limit)</option>
                  <option value="Platinum Fellow">Platinum Fellow (8 book limit)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-dept">Academic Department / Major</label>
              <input
                id="reg-dept"
                type="text"
                value={regDepartment}
                onChange={(e) => setRegDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
              />
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>I agree to library membership guidelines, loan policies, and book return deadlines.</span>
            </label>

            <div className="modal-actions-stacked">
              <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                {isLoading ? "Creating Member Account..." : "Register & Issue Member Card"}
              </button>

              <div className="auth-footer-prompt">
                <span>Already have an account? </span>
                <button
                  type="button"
                  className="link-highlight"
                  onClick={() => {
                    setAuthMode("login");
                    clearAuthError();
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD MODE */}
        {authMode === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="modal-form">
            <p className="forgot-explainer">
              Enter the university email address registered with your library account. We will issue a secure recovery link and temporary reset token.
            </p>

            <div className="form-group">
              <label htmlFor="forgot-email">Registered Email Address</label>
              <input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="alex.vance@university.edu"
                required
              />
            </div>

            <div className="modal-actions-stacked">
              <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                {isLoading ? "Processing Request..." : "Send Password Recovery Link"}
              </button>

              <div className="auth-footer-prompt">
                <button
                  type="button"
                  className="link-highlight"
                  onClick={() => {
                    setAuthMode("login");
                    clearAuthError();
                    setForgotSuccessMsg(null);
                  }}
                >
                  ← Return to Sign In
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
