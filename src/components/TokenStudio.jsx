import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TokenStudio() {
  const {
    token,
    member,
    isAuthenticated,
    tokenPayload,
    logout,
    triggerExpiredToken,
    triggerInvalidToken,
    setIsLoginModalOpen
  } = useAuth();

  const [copied, setCopied] = useState(false);

  const [now] = useState(() => Date.now());

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isExpired = Boolean(tokenPayload?.exp && now > tokenPayload.exp);
  const isCorrupted = Boolean(token && token.includes("INVALID_TOKEN"));

  return (
    <div className="token-studio-panel">
      <div className="token-studio-header">
        <div className="token-studio-title">
          <span className="studio-icon">🔐</span>
          <div>
            <h3>Security &amp; Session Token Studio</h3>
            <span className="studio-sub">JWT Bearer Token Management · Interceptor Attachment · 401 Expiry Handler</span>
          </div>
        </div>

        <div className="token-status-pill-wrap">
          {isAuthenticated && !isExpired && !isCorrupted ? (
            <span className="token-pill active-token">
              <span className="status-dot-pulse" /> Valid Bearer Token Active
            </span>
          ) : isExpired ? (
            <span className="token-pill expired-token">
              ⚠️ Token Expired (401 Handler Armed)
            </span>
          ) : isCorrupted ? (
            <span className="token-pill invalid-token">
              ❌ Token Invalid / Corrupted
            </span>
          ) : (
            <span className="token-pill no-token">
              ⚪ Guest Mode (No Token Present)
            </span>
          )}
        </div>
      </div>

      <div className="token-studio-body">
        {/* Token Inspection Box */}
        <div className="token-viewer-card">
          <div className="viewer-top-row">
            <span className="viewer-label">Raw JWT Bearer String (stored in <code>localStorage['booknest_auth_token']</code>):</span>
            {token && (
              <button type="button" className="btn-copy-token" onClick={handleCopy}>
                {copied ? "✓ Copied" : "📋 Copy Token"}
              </button>
            )}
          </div>

          <pre className="token-raw-box">
            {token || "No token found in browser storage. Login to generate an authenticated session."}
          </pre>

          {tokenPayload && (
            <div className="decoded-claims-table">
              <span className="claims-header">Decoded Token Claims (Attached to Axios Requests):</span>
              <div className="claims-grid">
                <div>
                  <small>Subject (ID):</small>
                  <strong>{tokenPayload.sub || "N/A"}</strong>
                </div>
                <div>
                  <small>Member Name:</small>
                  <strong>{tokenPayload.name || member?.name || "N/A"}</strong>
                </div>
                <div>
                  <small>Email:</small>
                  <strong>{tokenPayload.email || member?.email || "N/A"}</strong>
                </div>
                <div>
                  <small>Tier:</small>
                  <strong>{tokenPayload.cardTier || "Gold Scholar"}</strong>
                </div>
                <div>
                  <small>Issued At:</small>
                  <strong>{new Date(tokenPayload.iat).toLocaleTimeString()}</strong>
                </div>
                <div>
                  <small>Expires At:</small>
                  <strong className={isExpired ? "text-danger" : "text-success"}>
                    {new Date(tokenPayload.exp).toLocaleTimeString()} {isExpired && "(EXPIRED)"}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Token Test Actions Bar (Requirements 4d, 4e, 4f) */}
        <div className="token-test-actions-bar">
          <span className="test-bar-label">Interactive Token Security Controls:</span>
          <div className="test-buttons-wrap">
            {!isAuthenticated ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsLoginModalOpen(true)}
              >
                🔑 Member Login (Generate Token)
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={triggerExpiredToken}
                  title="Simulate token expiration by backdating the expiration claim to trigger 401"
                >
                  ⏳ Simulate Expired Token (Test 401)
                </button>

                <button
                  type="button"
                  className="btn btn-danger-subtle"
                  onClick={triggerInvalidToken}
                  title="Corrupt the token signature to test invalid token rejection"
                >
                  ⚠️ Simulate Invalid Token
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={logout}
                  title="Delete token from localStorage and clear session"
                >
                  🔓 Logout &amp; Delete Token
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
