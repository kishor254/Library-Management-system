// Reactive event bus for live middleware monitoring and logging
// Captures intercepted actions from both Redux Toolkit and Zustand stores

class MiddlewareEventBus {
  constructor() {
    this.listeners = new Set();
    this.events = [];
    this.maxEvents = 60;
  }

  emit(event) {
    const enrichedEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      fullTime: new Date().toISOString(),
      ...event
    };

    this.events = [enrichedEvent, ...this.events].slice(0, this.maxEvents);

    // Notify all active listeners
    this.listeners.forEach(listener => {
      try {
        listener(enrichedEvent, this.events);
      } catch (err) {
        console.error("Middleware event listener error:", err);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Call immediately with existing events
    listener(null, this.events);
    return () => this.listeners.delete(listener);
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
    this.listeners.forEach(listener => listener(null, []));
  }
}

export const middlewareEventBus = new MiddlewareEventBus();
