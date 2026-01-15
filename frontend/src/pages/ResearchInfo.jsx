// src/pages/ResearchInfo.jsx
import { Link } from "react-router-dom";

export default function ResearchInfo() {
  return (
    <div className="app-root">
      <div className="hero-bg" />

      <div className="questionnaire-shell">
        <div className="question-card info-page">
          <div className="hero-badge">
            Research overview • Self-discipline & academic paths
          </div>

          <h1 className="info-title">About the research</h1>
          <p className="info-lead">
            We explore whether <b>self-discipline</b> (habits, consistency, time
            management) can explain academic outcomes and the tendency to choose{" "}
            <b>STEM vs non-STEM</b> - alongside traditional performance indicators.
          </p>

          {/* QUICK CHIPS */}
          <div className="info-chips">
            <span className="info-pill">Behavior → outcomes</span>
            <span className="info-pill">STEM tendency</span>
            <span className="info-pill">Interpretable ML</span>
            <span className="info-pill">Instant scoring</span>
          </div>

          <div className="info-divider" />

          {/* WHY */}
          <div className="info-block">
            <h3 className="chart-title">Why this matters</h3>
            <p className="chart-subtitle">
              Grades alone don’t explain everything. Two students can have similar
              ability, but different results because of habits.
            </p>
            <ul className="info-list">
              <li>
                <b>Non-cognitive factors</b> (discipline, routine, consistency) can
                be strong predictors of performance.
              </li>
              <li>
                We test whether these signals also align with <b>STEM choices</b>.
              </li>
              <li>
                The app is a compact demo of how research → model → product UI.
              </li>
            </ul>
          </div>

          {/* QUESTIONS */}
          <div className="info-block">
            <h3 className="chart-title">Research questions</h3>
            <div className="info-grid">
              <div className="info-tile">
                <b>Performance</b>
                <span>Does self-discipline relate to GPA / school results?</span>
              </div>
              <div className="info-tile">
                <b>Study path</b>
                <span>Do habits predict STEM vs non-STEM tendency?</span>
              </div>
              <div className="info-tile">
                <b>Context</b>
                <span>How do background factors interact with behavior?</span>
              </div>
            </div>
          </div>

          {/* DATA */}
          <div className="info-block">
            <h3 className="chart-title">What we collect (questionnaire)</h3>
            <p className="chart-subtitle">
              Short inputs, then we convert them into a few meaningful indicators.
            </p>
            <div className="info-grid">
              <div className="info-chip">
                <b>Habits</b>
                <span>preparation, attendance, gaming, extra</span>
              </div>
              <div className="info-chip">
                <b>Work & language</b>
                <span>job + English proficiency</span>
              </div>
              <div className="info-chip">
                <b>Performance</b>
                <span>SSC/HSC + last & overall GPA</span>
              </div>
              <div className="info-chip">
                <b>Background</b>
                <span>income, hometown, semester, gender</span>
              </div>
            </div>
          </div>

          {/* HOW IT RUNS */}
          <div className="info-block">
            <h3 className="chart-title">How the app works</h3>

            <div className="info-steps">
              <div className="info-step">
                <div className="info-step-num">1</div>
                <div className="info-step-body">
                  <b>Normalize answers</b>
                  <span>convert inputs into comparable 0–1 signals</span>
                </div>
              </div>

              <div className="info-step">
                <div className="info-step-num">2</div>
                <div className="info-step-body">
                  <b>Build aggregates</b>
                  <span>create compact “scores” from multiple answers</span>
                </div>
              </div>

              <div className="info-step">
                <div className="info-step-num">3</div>
                <div className="info-step-body">
                  <b>Predict STEM tendency</b>
                  <span>pre-trained model returns probability + breakdown</span>
                </div>
              </div>
            </div>

            <p className="info-note">
              No long-term survey step is required to see a result — the backend
              loads a saved model and computes everything instantly.
            </p>
          </div>

          {/* PURPOSE */}
          <div className="info-block">
            <h3 className="chart-title">What this is (and isn’t)</h3>
            <div className="info-grid">
              <div className="info-tile good">
                <b>✅ It is</b>
                <span>a research-based demo: scoring + prediction + explanation</span>
              </div>
              <div className="info-tile warn">
                <b>⚠️ It isn’t</b>
                <span>a career oracle - interpret as a tendency, not a verdict</span>
              </div>
            </div>
          </div>

          {/* NAV */}
          <div className="question-nav" style={{ marginTop: 18 }}>
            <Link
              to="/"
              className="btn-ghost small"
              style={{ textDecoration: "none" }}
            >
              ← Back to home
            </Link>

            <Link
              to="/self-discipline"
              className="btn-primary small"
              style={{ textDecoration: "none" }}
            >
              Explore calculations →
            </Link>
          </div>
        </div>
      </div>





      {/* Local styles (no need to touch index.css) */}
      <style>{`
        .info-page { position: relative; }
        .info-title {
          font-size: 1.35rem;
          margin: 10px 0 6px;
          color: #f9fafb;
          letter-spacing: 0.02em;
        }
        .info-lead {
          opacity: 0.92;
          line-height: 1.7;
          margin: 0 0 12px;
        }
        .info-divider {
          height: 1px;
          background: rgba(148,163,184,0.18);
          margin: 16px 0;
        }

        .info-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        .info-pill {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(148,163,184,0.28);
          color: #e5e7eb;
          opacity: 0.95;
        }

        .info-block { margin-top: 14px; }

        .info-list {
          margin: 10px 0 0;
          padding-left: 18px;
          line-height: 1.7;
          opacity: 0.92;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 10px;
        }

        .info-chip, .info-tile {
          border-radius: 16px;
          padding: 12px 12px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148,163,184,0.22);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.65);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .info-chip b, .info-tile b { font-size: 0.9rem; color: #f9fafb; }
        .info-chip span, .info-tile span { font-size: 0.82rem; opacity: 0.85; line-height: 1.55; }

        .info-tile.good {
          border-color: rgba(34,197,94,0.25);
          background: radial-gradient(circle at top left, rgba(34,197,94,0.10), transparent 55%),
                      rgba(15, 23, 42, 0.6);
        }
        .info-tile.warn {
          border-color: rgba(249,115,22,0.25);
          background: radial-gradient(circle at top left, rgba(249,115,22,0.10), transparent 55%),
                      rgba(15, 23, 42, 0.6);
        }

        .info-steps {
          display: grid;
          gap: 10px;
          margin-top: 10px;
        }
        .info-step {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.55);
          border: 1px solid rgba(148,163,184,0.20);
        }
        .info-step-num {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          font-weight: 800;
          background: rgba(99,102,241,0.18);
          border: 1px solid rgba(129,140,248,0.35);
          color: #e5e7eb;
        }
        .info-step-body { display: flex; flex-direction: column; gap: 4px; }
        .info-step-body b { font-size: 0.9rem; }
        .info-step-body span { font-size: 0.82rem; opacity: 0.85; }

        .info-note {
          margin-top: 10px;
          opacity: 0.85;
          line-height: 1.65;
          font-size: 0.85rem;
        }

        @media (max-width: 640px) {
          .info-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}