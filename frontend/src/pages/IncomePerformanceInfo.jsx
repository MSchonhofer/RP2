// src/pages/IncomePerformanceInfo.jsx
import { Link } from "react-router-dom";

export default function IncomePerformanceInfo() {
  return (
    <div className="app-root">
      <div className="hero-bg" />

      <div className="questionnaire-shell">
        <div className="question-card info-page">
          <div className="hero-badge">Interpretation • Factors & limitations</div>

          <h1 className="info-title">How to read your result</h1>
          <p className="info-lead">
            Treat the outcome as an <b>estimated tendency</b>, not a final decision.
            The goal is to show which signals align with STEM vs non-STEM in the training data.
          </p>

          {/* INTERPRETATION */}
          <div className="info-block">
            <h3 className="chart-title">What the probability means</h3>
            <ul className="info-list">
              <li>
                <b>STEM fit %</b> is a likelihood score from the model - not “talent” and not “guarantee”.
              </li>
              <li>
                If your score is near <b>50%</b>, you’re closer to <b>balanced/either</b>.
              </li>
              <li>
                Use the <b>breakdown chart</b> to see which signals are high/low for you.
              </li>
            </ul>
          </div>

          {/* INCOME / ACCESS */}
          <div className="info-block">
            <h3 className="chart-title">Income & access (important nuance)</h3>
            <p className="chart-subtitle">
              Income is used as a rough proxy for access to resources - that’s all.
            </p>

            <ul className="info-list">
              <li>
                It can correlate with <b>time</b>, <b>equipment</b>, <b>tutoring</b>, or a calmer study environment.
              </li>
              <li>
                <b>Correlation ≠ causation</b>: it’s not a “reason”, just a statistical association.
              </li>
              <li>
                If you want a more fair model, income can be <b>removed</b> or audited for bias.
              </li>
            </ul>
          </div>

          {/* LIMITATIONS */}
          <div className="info-block">
            <h3 className="chart-title">Limitations (short & honest)</h3>
            <div className="info-grid">
              <div className="info-chip">
                <b>Class imbalance</b>
                <span>more STEM than non-STEM</span>
              </div>
              <div className="info-chip">
                <b>Category mapping</b>
                <span>answers → numbers is an assumption</span>
              </div>
              <div className="info-chip">
                <b>Generalization</b>
                <span>other universities may differ</span>
              </div>
              <div className="info-chip">
                <b>Sensitive signals</b>
                <span>income/gender may introduce bias</span>
              </div>
            </div>
          </div>

          {/* NEXT IMPROVEMENTS */}
          <div className="info-block">
            <h3 className="chart-title">If we had more time</h3>
            <ul className="info-list">
              <li>Re-balance classes (class_weight / resampling) and calibrate probabilities.</li>
              <li>Add a clear <b>math score</b> to compare “math vs self-discipline”.</li>
              <li>Explainability + bias checks (feature importance / SHAP).</li>
              <li>Validate on new survey data (even a small pilot sample).</li>
            </ul>
          </div>

          <div className="question-nav" style={{ marginTop: 18 }}>
            <Link
              to="/"
              className="btn-ghost small"
              style={{ textDecoration: "none" }}
            >
              ← Back
            </Link>
            <Link
              to="/"
              className="btn-primary small"
              style={{ textDecoration: "none" }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}