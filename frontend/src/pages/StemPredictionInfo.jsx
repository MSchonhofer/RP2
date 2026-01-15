// src/pages/StemPredictionInfo.jsx
import { Link } from "react-router-dom";

export default function StemPredictionInfo() {
  return (
    <div className="app-root">
      <div className="hero-bg" />

      <div className="questionnaire-shell">
        <div className="question-card info-page">
          <div className="hero-badge">Machine learning • STEM vs Non-STEM</div>

          <h1 className="info-title">STEM prediction model</h1>
          <p className="info-lead">
            After your answers are converted into <b>8 normalized features</b>, we run a trained
            classifier that returns a <b>STEM fit probability</b> (0–100%).
          </p>

          {/* 1) TARGET */}
          <div className="info-block">
            <h3 className="chart-title">1) What the model predicts (target)</h3>
            <p className="chart-subtitle">
              We train a binary label from the dataset:
            </p>

            <ul className="info-list">
              <li>
                <b>STEM = 1</b> if the department is <i>“Computer Science and Engineering”</i>
              </li>
              <li>
                <b>Non-STEM = 0</b> for other departments
              </li>
            </ul>
          </div>

          {/* 2) FEATURES */}
          <div className="info-block">
            <h3 className="chart-title">2) Inputs (8 features used by the model)</h3>
            <p className="chart-subtitle">
              Some questionnaire answers are merged into aggregates.
            </p>

            <div className="info-grid">
              <div className="info-chip"><b>self_discipline</b><span>habits aggregate</span></div>
              <div className="info-chip"><b>academic_score</b><span>SSC/HSC/Last/Overall</span></div>
              <div className="info-chip"><b>computer_skill</b><span>Computer / 5</span></div>
              <div className="info-chip"><b>english_skill</b><span>English / 5</span></div>
              <div className="info-chip"><b>income_norm</b><span>mapped</span></div>
              <div className="info-chip"><b>hometown_norm</b><span>mapped</span></div>
              <div className="info-chip"><b>gender_norm</b><span>mapped</span></div>
              <div className="info-chip"><b>semester_norm</b><span>semester / 8</span></div>
            </div>
          </div>

          {/* 3) PIPELINE */}
          <div className="info-block">
            <h3 className="chart-title">3) Training pipeline</h3>
            <p className="chart-subtitle">
              A simple, reliable baseline that works well for tabular data.
            </p>

            <div className="formula-block">
              X = [8 normalized features]{"\n"}
              stratified train/test split{"\n"}
              StandardScaler → LogisticRegression{"\n"}
              output = predict_proba(X)[STEM]
            </div>
          </div>

          {/* 4) WHY LOGREG */}
          <div className="info-block">
            <h3 className="chart-title">4) Why logistic regression?</h3>
            <ul className="info-list">
              <li><b>Interpretable:</b> we can inspect weights and explain what pushes STEM probability up/down.</li>
              <li><b>Stable:</b> less likely to overfit on a small dataset than complex models.</li>
              <li><b>Fast:</b> instant results after questionnaire submission.</li>
            </ul>
          </div>

          {/* 5) OUTPUTS */}
          <div className="info-block">
            <h3 className="chart-title">5) What the app shows</h3>
            <div className="info-grid">
              <div className="info-chip">
                <b>STEM fit %</b>
                <span>probability (0–100%)</span>
              </div>
              <div className="info-chip">
                <b>Label</b>
                <span>short interpretation</span>
              </div>
              <div className="info-chip">
                <b>Self-discipline %</b>
                <span>habit index (0–100%)</span>
              </div>
              <div className="info-chip">
                <b>Breakdown chart</b>
                <span>values of 8 features</span>
              </div>
            </div>
          </div>

          {/* 6) PERSISTENCE */}
          <div className="info-block">
            <h3 className="chart-title">6) How results are instant</h3>
            <p className="chart-subtitle">
              The trained model is saved once and loaded by the backend on startup.
              That’s why we can compute the result immediately (no need to collect new data first).
            </p>

            <div className="formula-block">
              trained_model → saved as .joblib{"\n"}
              backend loads model → predicts from your inputs
            </div>
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
              to="/income-performance"
              className="btn-primary small"
              style={{ textDecoration: "none" }}
            >
              Next →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}