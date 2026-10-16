import { useState, useEffect, useMemo } from "react";
import { useLibrary } from "../context/LibraryStoreContext";
import { middlewareEventBus } from "../utils/middlewareEventBus";

export default function MiddlewareInspectorPage() {
  const {
    activeStore,
    books,
    borrowedBooks,
    holds,
    readingHistory,
    loading,
    borrowBook,
    returnBook,
    renewBook,
    holdBook,
    cancelHold,
    updateMember,
    resetLibrary,
    simulateAsyncLoad,
    reduxState,
    zustandState
  } = useLibrary();

  const [events, setEvents] = useState([]);
  const [filterStore, setFilterStore] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("middleware");

  useEffect(() => {
    const unsub = middlewareEventBus.subscribe((newEvent, allEvents) => {
      setEvents([...allEvents]);
    });
    return unsub;
  }, []);

  const [storageTick, setStorageTick] = useState(0);
  const refreshStorageData = () => setStorageTick(t => t + 1);

  // Compute actual localStorage contents dynamically
  const storageData = useMemo(() => {
    try {
      const rtkRaw = localStorage.getItem("booknest_redux_state");
      const zustandRaw = localStorage.getItem("booknest_zustand_state");
      return {
        redux: rtkRaw ? JSON.parse(rtkRaw) : null,
        zustand: zustandRaw ? JSON.parse(zustandRaw) : null,
        reduxRawSize: rtkRaw ? (new Blob([rtkRaw]).size / 1024).toFixed(2) : "0",
        zustandRawSize: zustandRaw ? (new Blob([zustandRaw]).size / 1024).toFixed(2) : "0"
      };
    } catch {
      return { redux: null, zustand: null, reduxRawSize: "0", zustandRawSize: "0" };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageTick, events, activeStore]);

  const filteredEvents = events.filter(e => {
    if (filterStore === "redux") return e.store === "Redux Toolkit";
    if (filterStore === "zustand") return e.store === "Zustand";
    return true;
  });

  return (
    <div className="page-container inspector-page">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">EXPERIMENT 2 LABORATORY BENCH</span>
          <h1>State Management &amp; Middleware Inspector</h1>
          <p className="page-description">
            Deep-dive technical evaluation suite for Redux Toolkit, Zustand, custom middleware interception, browser storage synchronization, and async state flows.
          </p>
        </div>

        <div className="inspector-controls">
          <button
            type="button"
            className="btn btn-outline"
            onClick={refreshStorageData}
          >
            ↻ Refresh Storage
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => simulateAsyncLoad(1200)}
            disabled={loading}
          >
            {loading ? "Simulating Latency..." : "⏳ Test 1.2s Network Loading"}
          </button>
        </div>
      </div>

      {/* Quick Test Bench Bar for Examiners */}
      <section className="test-bench-panel">
        <div className="test-bench-header">
          <div>
            <strong>Interactive Lab Trigger Bench:</strong>
            <p>Click these buttons to dispatch library actions and observe the middleware intercept and log them live below.</p>
          </div>
          <span className="current-engine-pill">
            Targeting: <strong>{activeStore.toUpperCase()}</strong>
          </span>
        </div>

        <div className="test-buttons-grid">
          <button
            type="button"
            className="btn btn-sm btn-borrow"
            onClick={() => borrowBook(1)}
            title="Borrow 'Atomic Habits' (Book #1)"
          >
            Dispatch: Borrow Book #1
          </button>

          <button
            type="button"
            className="btn btn-sm btn-borrow"
            onClick={() => borrowBook(2)}
            title="Borrow 'The Psychology of Money' (Book #2)"
          >
            Dispatch: Borrow Book #2
          </button>

          <button
            type="button"
            className="btn btn-sm btn-return"
            onClick={() => returnBook(4)}
            title="Return 'Deep Work' (Book #4)"
          >
            Dispatch: Return Book #4
          </button>

          <button
            type="button"
            className="btn btn-sm btn-renew"
            onClick={() => renewBook(4)}
            title="Renew 'Deep Work' (Book #4)"
          >
            Dispatch: Renew Book #4
          </button>

          <button
            type="button"
            className="btn btn-sm btn-hold"
            onClick={() => holdBook(9)}
            title="Place Hold on Book #9"
          >
            Dispatch: Hold Book #9
          </button>

          <button
            type="button"
            className="btn btn-sm btn-cancel-hold"
            onClick={() => cancelHold(9)}
            title="Cancel Hold on Book #9"
          >
            Dispatch: Cancel Hold #9
          </button>

          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => updateMember({ name: "Dr. Evelyn Reed", cardTier: "Platinum Fellow" })}
          >
            Dispatch: Update Member
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={resetLibrary}
          >
            Dispatch: Reset State
          </button>
        </div>
      </section>

      {/* Navigation Tabs for Inspector Views */}
      <div className="inspector-tabs">
        <button
          type="button"
          className={`inspector-tab-btn ${activeTab === "middleware" ? "active" : ""}`}
          onClick={() => setActiveTab("middleware")}
        >
          ⚡ Live Middleware Action Stream ({events.length})
        </button>
        <button
          type="button"
          className={`inspector-tab-btn ${activeTab === "storage" ? "active" : ""}`}
          onClick={() => setActiveTab("storage")}
        >
          💾 Browser Storage Sync (localStorage)
        </button>
        <button
          type="button"
          className={`inspector-tab-btn ${activeTab === "rawState" ? "active" : ""}`}
          onClick={() => setActiveTab("rawState")}
        >
          🔍 Active Store State Tree (JSON)
        </button>
        <button
          type="button"
          className={`inspector-tab-btn ${activeTab === "architecture" ? "active" : ""}`}
          onClick={() => setActiveTab("architecture")}
        >
          📐 Architecture &amp; Topic Analysis
        </button>
      </div>

      {/* Tab 1: Live Middleware Action Stream */}
      {activeTab === "middleware" && (
        <div className="inspector-pane">
          <div className="terminal-card">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
                <span className="terminal-title">LIVE ACTION INTERCEPTOR CONSOLE</span>
              </div>

              <div className="terminal-filters">
                <button
                  type="button"
                  className={`term-pill ${filterStore === "all" ? "active" : ""}`}
                  onClick={() => setFilterStore("all")}
                >
                  All ({events.length})
                </button>
                <button
                  type="button"
                  className={`term-pill redux-pill ${filterStore === "redux" ? "active" : ""}`}
                  onClick={() => setFilterStore("redux")}
                >
                  Redux ({events.filter(e => e.store === "Redux Toolkit").length})
                </button>
                <button
                  type="button"
                  className={`term-pill zustand-pill ${filterStore === "zustand" ? "active" : ""}`}
                  onClick={() => setFilterStore("zustand")}
                >
                  Zustand ({events.filter(e => e.store === "Zustand").length})
                </button>
                <button
                  type="button"
                  className="term-pill clear-pill"
                  onClick={() => middlewareEventBus.clearEvents()}
                >
                  Clear Console
                </button>
              </div>
            </div>

            <div className="terminal-body">
              {filteredEvents.length === 0 ? (
                <div className="terminal-empty">
                  <p>⚡ No actions intercepted in the stream yet.</p>
                  <small>Use the trigger buttons above or interact with the app to monitor real-time middleware execution.</small>
                </div>
              ) : (
                <div className="terminal-rows">
                  {filteredEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className={`terminal-row ${selectedEvent?.id === evt.id ? "selected" : ""}`}
                      onClick={() => setSelectedEvent(selectedEvent?.id === evt.id ? null : evt)}
                    >
                      <div className="term-row-line">
                        <span className="term-time">[{evt.timestamp}]</span>
                        <span className={`term-store-tag ${evt.store === "Redux Toolkit" ? "redux" : "zustand"}`}>
                          {evt.store === "Redux Toolkit" ? "RTK_MIDDLEWARE" : "ZUSTAND_MIDDLEWARE"}
                        </span>
                        <span className="term-action">{evt.actionType}</span>
                        <span className="term-latency">{evt.durationMs}ms</span>
                        <span className="term-summary">{evt.summary}</span>
                      </div>

                      {selectedEvent?.id === evt.id && (
                        <div className="term-event-expanded">
                          <div className="expanded-title">Dispatched Payload &amp; Metadata:</div>
                          <pre className="expanded-code">
                            {JSON.stringify(evt, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="terminal-footer">
              <span>● Listening to <code>libraryMiddleware</code> &amp; <code>zustandMonitorMiddleware</code>. Click any row to expand payload details.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Browser Storage Synchronization */}
      {activeTab === "storage" && (
        <div className="inspector-pane">
          <div className="storage-cards-grid">
            {/* Redux Storage */}
            <div className="storage-card">
              <div className="storage-header">
                <span className="storage-engine-badge redux">REDUX TOOLKIT STORAGE</span>
                <span className="storage-key">Key: <code>booknest_redux_state</code></span>
                <span className="storage-size">{storageData.reduxRawSize || "0"} KB</span>
              </div>
              <p className="storage-note">
                Synchronized automatically by <code>libraryMiddleware</code> on every dispatched action.
              </p>
              <div className="storage-preview-box">
                <pre>{JSON.stringify(storageData.redux || "No stored state found", null, 2)}</pre>
              </div>
            </div>

            {/* Zustand Storage */}
            <div className="storage-card">
              <div className="storage-header">
                <span className="storage-engine-badge zustand">ZUSTAND STORAGE</span>
                <span className="storage-key">Key: <code>booknest_zustand_state</code></span>
                <span className="storage-size">{storageData.zustandRawSize || "0"} KB</span>
              </div>
              <p className="storage-note">
                Synchronized automatically by Zustand's <code>persist</code> middleware into <code>localStorage</code>.
              </p>
              <div className="storage-preview-box">
                <pre>{JSON.stringify(storageData.zustand || "No stored state found", null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Raw Active Store State Tree */}
      {activeTab === "rawState" && (
        <div className="inspector-pane">
          <div className="raw-state-box">
            <div className="raw-state-header">
              <h3>Currently Active Store State Tree ({activeStore.toUpperCase()})</h3>
              <span>{books.length} Books · {borrowedBooks.length} Borrowed · {holds.length} Holds · {readingHistory.length} History</span>
            </div>
            <pre className="raw-json-viewer">
              {JSON.stringify(
                activeStore === "redux" ? reduxState : zustandState,
                (key, val) => (key === "image" ? undefined : val),
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Architecture & Topic Analysis */}
      {activeTab === "architecture" && (
        <div className="inspector-pane">
          <div className="arch-guide-card">
            <h2>Experiment 2 Implementation Breakdown</h2>

            <div className="arch-grid">
              <div className="arch-card">
                <h3>a) Global Library Store</h3>
                <p>
                  Implemented both <strong>Redux Toolkit</strong> (<code>configureStore</code>, <code>createSlice</code>) and <strong>Zustand</strong> (<code>create</code>).
                  A unified context adapter allows live switching between the two stores with zero page reloads.
                </p>
              </div>

              <div className="arch-card">
                <h3>b) Managed Entities</h3>
                <p>
                  Full lifecycle management for:
                  <br />• <strong>Books:</strong> Catalog collection with availability flags and ratings.
                  <br />• <strong>Borrowed Books:</strong> Loan terms, due dates, and renewal tallies.
                  <br />• <strong>Member Information:</strong> Account credentials, membership tier, and borrowing quotas.
                  <br />• <strong>Reading History:</strong> Immutable chronological action audit log.
                </p>
              </div>

              <div className="arch-card">
                <h3>c) Library Actions</h3>
                <p>
                  • <strong>borrowBook:</strong> Checks quota, marks book unavailable, adds loan record with 14-day due date.
                  <br />• <strong>returnBook:</strong> Restores book availability, removes loan record, logs return.
                  <br />• <strong>renewBook:</strong> Enforces max 2 renewals rule, extends due date by +14 days.
                  <br />• <strong>holdBook:</strong> Queues reader on checked out items.
                  <br />• <strong>cancelHold:</strong> Removes reservation from queue.
                </p>
              </div>

              <div className="arch-card">
                <h3>d) Custom Middleware</h3>
                <p>
                  Custom Redux middleware (<code>libraryMiddleware</code>) and custom Zustand middleware (<code>zustandMonitorMiddleware</code>) intercept all state transitions, compute execution latency, log formatted group logs to DevTools, and emit live events to the on-screen action inspector HUD.
                </p>
              </div>

              <div className="arch-card">
                <h3>e) Browser Storage Sync</h3>
                <p>
                  • Redux: State persistence mechanism writes updated slices to <code>localStorage['booknest_redux_state']</code> on every action and hydrates state on initialization.
                  <br />• Zustand: Built-in <code>persist</code> middleware automatically syncs slices to <code>localStorage['booknest_zustand_state']</code>.
                </p>
              </div>

              <div className="arch-card">
                <h3>f) Loading &amp; Empty States</h3>
                <p>
                  • <strong>Loading States:</strong> Animated shimmer Skeleton cards and button spinners during simulated or actual network fetching.
                  <br />• <strong>Empty States:</strong> Elegant, friendly SVG vector empty states for zero borrowed books, zero holds, cleared reading history, and empty search results.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
