import { useState, useEffect } from "react";
import { middlewareEventBus } from "../utils/middlewareEventBus";

export default function MiddlewareMonitor({ isOpen, onClose }) {
  const [events, setEvents] = useState([]);
  const [filterStore, setFilterStore] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const unsubscribe = middlewareEventBus.subscribe((newEvent, allEvents) => {
      setEvents([...allEvents]);
    });
    return unsubscribe;
  }, []);

  const filteredEvents = events.filter(evt => {
    if (filterStore === "redux") return evt.store === "Redux Toolkit";
    if (filterStore === "zustand") return evt.store === "Zustand";
    return true;
  });

  if (!isOpen) return null;

  return (
    <aside className="middleware-hud" aria-label="Live Middleware Action Inspector">
      <div className="hud-header">
        <div className="hud-title-wrap">
          <span className="hud-live-dot" />
          <h3>⚡ Middleware Action Monitor</h3>
          <span className="hud-badge">{filteredEvents.length} events</span>
        </div>

        <div className="hud-controls">
          <div className="hud-filters">
            <button
              type="button"
              className={`hud-tab ${filterStore === "all" ? "active" : ""}`}
              onClick={() => setFilterStore("all")}
            >
              All ({events.length})
            </button>
            <button
              type="button"
              className={`hud-tab redux-tab ${filterStore === "redux" ? "active" : ""}`}
              onClick={() => setFilterStore("redux")}
            >
              Redux ({events.filter(e => e.store === "Redux Toolkit").length})
            </button>
            <button
              type="button"
              className={`hud-tab zustand-tab ${filterStore === "zustand" ? "active" : ""}`}
              onClick={() => setFilterStore("zustand")}
            >
              Zustand ({events.filter(e => e.store === "Zustand").length})
            </button>
          </div>

          <button
            type="button"
            className="hud-btn clear-btn"
            onClick={() => middlewareEventBus.clearEvents()}
            title="Clear all intercepted actions"
          >
            Clear
          </button>
          <button
            type="button"
            className="hud-btn close-btn"
            onClick={onClose}
            title="Minimize monitor HUD"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="hud-body">
        {filteredEvents.length === 0 ? (
          <div className="hud-empty">
            <p>⚡ No actions intercepted yet.</p>
            <small>Borrow, return, renew, or hold a book to see middleware log events live here.</small>
          </div>
        ) : (
          <div className="hud-events-list">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className={`hud-event-row ${selectedEvent?.id === evt.id ? "selected" : ""}`}
                onClick={() => setSelectedEvent(selectedEvent?.id === evt.id ? null : evt)}
              >
                <div className="hud-row-meta">
                  <span className={`hud-store-tag ${evt.store === "Redux Toolkit" ? "redux" : "zustand"}`}>
                    {evt.store === "Redux Toolkit" ? "RTK" : "ZUSTAND"}
                  </span>
                  <span className="hud-action-name">{evt.actionType}</span>
                  <span className="hud-latency">{evt.durationMs}ms</span>
                  <span className="hud-time">{evt.timestamp}</span>
                </div>
                <div className="hud-row-summary">{evt.summary}</div>

                {selectedEvent?.id === evt.id && (
                  <div className="hud-payload-details">
                    <div className="payload-title">Action Payload:</div>
                    <pre className="payload-json">
                      {JSON.stringify(evt.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hud-footer">
        <span>Intercepting actions via <code>libraryMiddleware</code> (Redux) &amp; <code>zustandMonitorMiddleware</code> (Zustand).</span>
      </div>
    </aside>
  );
}
