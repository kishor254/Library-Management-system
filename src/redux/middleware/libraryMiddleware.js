import { middlewareEventBus } from "../../utils/middlewareEventBus";

// Redux Middleware: Monitors all library actions, measures execution latency,
// logs formatted output to console, synchronizes state with browser localStorage,
// and broadcasts intercepted events to the live on-screen Middleware Monitor HUD.

export const libraryMiddleware = store => next => action => {
  const startTime = performance.now();
  const prevState = store.getState().library;

  // Pass action through reducer pipeline
  const result = next(action);

  const duration = (performance.now() - startTime).toFixed(2);
  const nextState = store.getState().library;

  // Only monitor library-related actions
  if (action.type && action.type.startsWith("library/")) {
    const actionName = action.type.replace("library/", "");

    // 1. Console Grouped Logging for developer inspection
    console.groupCollapsed(
      `%c[Redux Middleware] %c${action.type} %c(${duration}ms)`,
      "color: #8b5cf6; font-weight: bold;",
      "color: #3b82f6; font-weight: 600;",
      "color: #10b981;"
    );
    console.log("%cAction Payload:", "color: #f59e0b; font-weight: bold;", action.payload);
    console.log("%cPrevious State:", "color: #64748b;", prevState);
    console.log("%cNext State:", "color: #10b981; font-weight: bold;", nextState);
    console.groupEnd();

    // 2. Broadcast to reactive Event Bus for on-screen live UI Monitor
    middlewareEventBus.emit({
      store: "Redux Toolkit",
      actionType: action.type,
      actionName,
      payload: action.payload,
      durationMs: duration,
      summary: summarizeStateChange(actionName, action.payload, prevState, nextState)
    });

    // 3. Synchronize state with browser storage (Requirement e)
    try {
      const stateToPersist = {
        books: nextState.books,
        borrowedBooks: nextState.borrowedBooks,
        holds: nextState.holds,
        readingHistory: nextState.readingHistory,
        member: nextState.member
      };
      localStorage.setItem("booknest_redux_state", JSON.stringify(stateToPersist));
    } catch (err) {
      console.warn("Redux storage synchronization failed:", err);
    }
  }

  return result;
};

function summarizeStateChange(actionName, payload, prev, next) {
  switch (actionName) {
    case "borrowBook": {
      const book = next.books.find(b => b.id === Number(payload));
      return `Book borrowed: "${book?.title || payload}". Due in 14 days.`;
    }
    case "returnBook": {
      const book = prev.books.find(b => b.id === Number(payload));
      return `Book returned: "${book?.title || payload}". Returned to circulation.`;
    }
    case "renewBook": {
      const book = next.borrowedBooks.find(b => b.id === Number(payload));
      return `Loan renewed: "${book?.title || payload}". New due date: ${book?.dueDate}.`;
    }
    case "holdBook": {
      const book = next.books.find(b => b.id === Number(payload));
      return `Hold placed: "${book?.title || payload}". Queued successfully.`;
    }
    case "cancelHold": {
      return `Hold cancelled for book ID ${payload}.`;
    }
    case "updateMember": {
      return `Member profile updated: ${payload.name || "profile info"}.`;
    }
    case "clearHistory": {
      return `Reading history cleared (${prev.readingHistory.length} events removed).`;
    }
    case "resetLibrary": {
      return `Library state reset to initial catalog baseline.`;
    }
    default:
      return `State mutated via ${actionName}.`;
  }
}
