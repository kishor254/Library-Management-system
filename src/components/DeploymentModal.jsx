import { useState, useEffect } from "react";

export default function DeploymentModal({ isOpen, onClose }) {
  const [swStatus, setSwStatus] = useState("Checking...");
  const [copiedCmd, setCopiedCmd] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        if (regs.length > 0) {
          setSwStatus("Active & Registered (PWA Ready)");
        } else {
          setSwStatus("Supported (Registered in Production Build)");
        }
      });
    } else {
      setSwStatus("Not supported in current browser");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card deployment-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "780px", width: "95%" }}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge-icon">🚀</span>
            <div>
              <h2>Deployment &amp; Production Hub</h2>
              <span className="modal-subtitle">
                Experiment 3: Production Build, SPA Cloud Hosting &amp; PWA Strategy
              </span>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: "75vh", overflowY: "auto", padding: "20px" }}>
          {/* Quick Metrics Bar */}
          <div className="deployment-metrics-grid">
            <div className="deploy-metric-box">
              <span>TARGET BUNDLER</span>
              <strong>Vite 8.3 + Rollup</strong>
              <small>ES Modules + Tree Shaking</small>
            </div>
            <div className="deploy-metric-box">
              <span>OUTPUT DIRECTORY</span>
              <strong><code>dist/</code></strong>
              <small>Static Assets + Code Splitting</small>
            </div>
            <div className="deploy-metric-box">
              <span>PWA STATUS</span>
              <strong className="text-success">{swStatus}</strong>
              <small>Cache Strategy: Stale-While-Revalidate</small>
            </div>
            <div className="deploy-metric-box">
              <span>SPA ROUTING</span>
              <strong>HTTP 200 Rewrites</strong>
              <small>Vercel &amp; Netlify Configured</small>
            </div>
          </div>

          {/* Section 1: Build & Deploy Commands */}
          <div className="deploy-section">
            <h3 className="deploy-section-title">📦 Production Build &amp; Preview Commands</h3>
            <div className="deploy-command-list">
              <div className="deploy-command-row">
                <div>
                  <strong>1. Create Production Bundle</strong>
                  <code>npm run build</code>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => copyToClipboard("npm run build", "build")}
                >
                  {copiedCmd === "build" ? "✓ Copied" : "Copy"}
                </button>
              </div>

              <div className="deploy-command-row">
                <div>
                  <strong>2. Local Production Preview</strong>
                  <code>npm run preview</code>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => copyToClipboard("npm run preview", "preview")}
                >
                  {copiedCmd === "preview" ? "✓ Copied" : "Copy"}
                </button>
              </div>

              <div className="deploy-command-row">
                <div>
                  <strong>3. Deploy to Vercel (CLI)</strong>
                  <code>npx vercel --prod</code>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => copyToClipboard("npx vercel --prod", "vercel")}
                >
                  {copiedCmd === "vercel" ? "✓ Copied" : "Copy"}
                </button>
              </div>

              <div className="deploy-command-row">
                <div>
                  <strong>4. Deploy to Netlify (CLI)</strong>
                  <code>npx netlify deploy --prod --dir=dist</code>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => copyToClipboard("npx netlify deploy --prod --dir=dist", "netlify")}
                >
                  {copiedCmd === "netlify" ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Code Splitting Chunks */}
          <div className="deploy-section">
            <h3 className="deploy-section-title">⚡ Optimized Code-Splitting Architecture</h3>
            <div className="chunks-table-wrapper">
              <table className="chunks-table">
                <thead>
                  <tr>
                    <th>Chunk Name</th>
                    <th>Type</th>
                    <th>Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>react-vendor-*.js</code></td>
                    <td>Core Framework</td>
                    <td>Static Preload (React, ReactDOM, Router)</td>
                  </tr>
                  <tr>
                    <td><code>network-vendor-*.js</code></td>
                    <td>Networking</td>
                    <td>Static Preload (Axios)</td>
                  </tr>
                  <tr>
                    <td><code>state-vendor-*.js</code></td>
                    <td>Global Store</td>
                    <td>Static Preload (Redux Toolkit &amp; Zustand)</td>
                  </tr>
                  <tr>
                    <td><code>MemberModal-*.js</code></td>
                    <td>Lazy Modal</td>
                    <td>On-demand (`React.lazy()` + Suspense)</td>
                  </tr>
                  <tr>
                    <td><code>TokenStudio-*.js</code></td>
                    <td>Lazy Module</td>
                    <td>On-demand (`React.lazy()` + Suspense)</td>
                  </tr>
                  <tr>
                    <td><code>BookCrudModal-*.js</code></td>
                    <td>Lazy Modal</td>
                    <td>On-demand (`React.lazy()` + Suspense)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Cloud Hosting Configuration Files */}
          <div className="deploy-section">
            <h3 className="deploy-section-title">☁️ Configured Cloud Files in Repository</h3>
            <div className="config-cards-grid">
              <div className="config-file-card">
                <span className="file-tag">VERCEL</span>
                <strong><code>vercel.json</code></strong>
                <p>Rewrites all incoming requests to <code>/index.html</code> with immutable caching for <code>/assets/</code>.</p>
              </div>

              <div className="config-file-card">
                <span className="file-tag">NETLIFY</span>
                <strong><code>public/_redirects</code></strong>
                <p>Single-Page Application rewrite rule: <code>/* /index.html 200</code> for dynamic routing preservation.</p>
              </div>

              <div className="config-file-card">
                <span className="file-tag">PWA MANIFEST</span>
                <strong><code>public/manifest.json</code></strong>
                <p>Configured standalone app name, theme color (<code>#4f46e5</code>), background color, and icons.</p>
              </div>

              <div className="config-file-card">
                <span className="file-tag">SERVICE WORKER</span>
                <strong><code>public/sw.js</code></strong>
                <p>Service Worker implementing Stale-While-Revalidate caching for instant offline app execution.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="text-muted" style={{ fontSize: "13px" }}>
            Ready for Vercel, Netlify, Render, or GitHub Pages deployment
          </span>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
