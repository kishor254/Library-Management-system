import { useEffect } from "react";
import { useLibrary } from "../context/LibraryStoreContext";

export default function Toast() {
  const { error, clearError } = useLibrary();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div className="toast-notification-banner" role="alert">
      <div className="toast-content">
        <span className="toast-icon">⚠️</span>
        <span className="toast-message">{error}</span>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={clearError}
        aria-label="Dismiss message"
      >
        ✕
      </button>
    </div>
  );
}
