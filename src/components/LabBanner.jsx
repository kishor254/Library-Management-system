import { useLibrary } from "../context/LibraryStoreContext";

export default function LabBanner({ onToggleMonitor, isMonitorOpen, monitorCount }) {
  const {
    activeStore,
    setActiveStore,
    simulateAsyncLoad,
    resetLibrary,
    loading
  } = useLibrary();

  const storageKey = activeStore === "redux" ? "booknest_redux_state" : "booknest_zustand_state";

  return (
    <div className="lab-banner">
      <div className="lab-banner-content">
        <div className="lab-badge-title">
          <span className="lab-pill">EXPERIMENT 2</span>
          <div className="lab-headings">
            <strong>Library State Management</strong>
            <span className="lab-sub">Redux Toolkit · Zustand · Custom Middleware · Storage Sync</span>
          </div>
        </div>

        {/* Global Store Switcher (Requirement a) */}
        <div className="lab-store-selector" role="group" aria-label="Select State Management Store">
          <span className="store-label">Active Store:</span>
          <button
            type="button"
            className={`store-btn ${activeStore === "redux" ? "active redux" : ""}`}
            onClick={() => setActiveStore("redux")}
            title="Switch to Redux Toolkit slice with custom logger middleware"
          >
            <span className="store-dot redux-dot" />
            <span className="store-name">Redux Toolkit</span>
            {activeStore === "redux" && <span className="active-tag">ACTIVE</span>}
          </button>

          <button
            type="button"
            className={`store-btn ${activeStore === "zustand" ? "active zustand" : ""}`}
            onClick={() => setActiveStore("zustand")}
            title="Switch to Zustand store with custom monitor and persist middleware"
          >
            <span className="store-dot zustand-dot" />
            <span className="store-name">Zustand</span>
            {activeStore === "zustand" && <span className="active-tag">ACTIVE</span>}
          </button>
        </div>

        {/* Lab Actions & Storage Sync Indicator (Requirement d, e, f) */}
        <div className="lab-actions-group">
          <div className="storage-sync-pill" title={`Browser storage key: ${storageKey}`}>
            <span className="sync-pulse" />
            <span className="sync-text">Storage: <code>{storageKey}</code></span>
          </div>

          <button
            type="button"
            className="lab-action-btn load-test-btn"
            disabled={loading}
            onClick={() => simulateAsyncLoad(1000)}
            title="Simulate 1 second network latency to inspect loading skeletons"
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <span>⏳ Test Async Load</span>
              </>
            )}
          </button>

          <button
            type="button"
            className={`lab-action-btn monitor-toggle-btn ${isMonitorOpen ? "open" : ""}`}
            onClick={onToggleMonitor}
            title="Open live Middleware Event Monitor HUD"
          >
            <span className="btn-bolt">⚡</span>
            <span>Middleware HUD</span>
            {monitorCount > 0 && <span className="monitor-counter-badge">{monitorCount}</span>}
          </button>

          <button
            type="button"
            className="lab-action-btn reset-btn"
            onClick={() => {
              if (window.confirm("Reset library state to clean initial defaults?")) {
                resetLibrary();
              }
            }}
            title="Clear local storage and restore default catalog"
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
}
