# 📚 BookNest - Enterprise Digital Library Management System

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.6-764abc?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown)](https://github.com/pmndrs/zustand)
[![Tests](https://img.shields.io/badge/Vitest-16%20Passed-success?logo=vitest&logoColor=white)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange?logo=pwa&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade, modern React web application for digital library cataloging, automated book circulation, member quota tracking, and dual state-management architectures (Redux Toolkit & Zustand).

GitHub Repository: [https://github.com/kishor254/Library-Management-system](https://github.com/kishor254/Library-Management-system)

---

## 🌟 Key Features

### 1. Dual Store State Architecture
* **Redux Toolkit**: Centralized store with standard action dispatching, slice architecture (`librarySlice.js`), and custom action-monitoring middleware.
* **Zustand**: Fast, lightweight atomic store with middleware logging (`libraryStore.js`).
* **Live Store Switcher**: Switch between Redux Toolkit and Zustand on the fly with real-time state synchronization via `LocalStorage`.

### 2. Comprehensive Book & Member Operations
* **Circulation Lifecycle**: Real-time **Borrow**, **Return**, **Renew**, and **Hold** actions.
* **Member Quotas & Tier System**: Tracks borrowing limits (max 5 books) with dynamic tier calculation (`Silver`, `Gold`, `Platinum`).
* **Full CRUD Operations**: Modal interface to **Add**, **Edit**, **Delete**, and **View Details** of books with automatic category tagging and ISBN generation.
* **Smart Search & Filters**: Instant full-text search across titles, authors, categories, and tags with zero re-render lag.

### 3. Automated Testing Suite (Vitest + React Testing Library)
* **16 Automated Component & Integration Tests**:
  * Book cards, badges, and catalog layout rendering.
  * Real-time search query filtering and category tabs.
  * Borrow quota enforcement and borrow/return transactions.
  * Shimmer loading skeleton and asynchronous API error simulation.
  * Dynamic route parameter testing for `/book/:id`.

### 4. Production Performance & Optimization
* **Code Splitting**: Rollup chunk splitting (`react-vendor`, `network-vendor`, `state-vendor`).
* **Lazy Loading**: Route-level and modal-level `React.lazy()` with `<Suspense>`.
* **PWA & Offline Capability**: Service Worker (`sw.js`) with cache fallback and Web App Manifest (`manifest.json`).
* **Accessibility (A11y)**: ARIA attributes, semantic HTML5, and full keyboard navigation.
* **API Security Studio**: Dedicated Bearer token interceptor and secure input sanitization simulator.

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation
```bash
# Clone repository
git clone https://github.com/kishor254/Library-Management-system.git

# Enter project directory
cd Library-Management-system

# Install dependencies
npm install
```

### Running Locally
```bash
# Start development server
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

### Running Tests
```bash
# Run all unit and component tests with Vitest
npm test
```

### Production Build & Preview
```bash
# Build optimized production bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Architecture

```text
Library-Management-system/
├── public/
│   ├── _redirects             # Netlify SPA rewrite configuration
│   ├── manifest.json          # PWA Web App Manifest
│   └── sw.js                  # PWA Service Worker for offline caching
├── src/
│   ├── __tests__/             # Vitest & RTL test suites (16 tests)
│   │   ├── BookCard.test.jsx
│   │   ├── BookDetail.test.jsx
│   │   ├── BorrowingAndLoading.test.jsx
│   │   ├── SearchAndFilter.test.jsx
│   │   └── testUtils.jsx
│   ├── components/            # Reusable UI components
│   │   ├── BookCard.jsx
│   │   ├── BookCrudModal.jsx
│   │   ├── DeploymentModal.jsx
│   │   ├── EmptyState.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── LoginModal.jsx
│   │   ├── MemberModal.jsx
│   │   ├── Toast.jsx
│   │   └── TokenStudio.jsx
│   ├── context/               # React Context Providers
│   │   ├── AuthContext.jsx
│   │   └── LibraryStoreContext.jsx
│   ├── pages/                 # Main page views
│   │   ├── BookDetail.jsx     # Dedicated book details (/book/:id)
│   │   └── MemberProfile.jsx  # Member account profile (/profile)
│   ├── redux/                 # Redux Toolkit store, slice & middleware
│   ├── store/                 # Zustand store & logger middleware
│   ├── App.jsx                # Main application orchestrator
│   └── index.css              # Custom Vanilla CSS Design System
├── vercel.json                # Vercel SPA rewrite & cache headers
├── vite.config.js             # Vite configuration with chunk splitting
└── package.json               # Project manifest & scripts
```

---

## ☁️ Deployment

* **Vercel**: Deploy in one click or via CLI: `npx vercel --prod`
* **Netlify**: Deploy via CLI: `npx netlify deploy --prod --dir=dist`
* Both platforms include configured SPA rewrites to ensure `/book/:id` routes reload cleanly.

---

## 📄 License
This project is open-sourced under the MIT License.
