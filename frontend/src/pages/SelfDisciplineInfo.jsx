// src/pages/SelfDisciplineInfo.jsx
import { Link } from "react-router-dom";

export default function SelfDisciplineInfo() {
  return (
    <div className="app-root">
      <div className="hero-bg" />

      <div className="questionnaire-shell">
        <div className="question-card info-page">
          <div className="hero-badge">How it’s calculated • Self-discipline index</div>

          <h1 className="info-title">Self-discipline score</h1>
          <p className="info-lead">
            To make different answers comparable, we first convert inputs into a
            <b> 0–1 scale</b>, then combine them into a few <b>aggregates</b>.
            The model uses <b>8 final features</b> (some of your 15 questions are merged).
          </p>

          <div className="info-block">
            <h3 className="chart-title">1) Normalization (0–1)</h3>
            <p className="chart-subtitle">
              Numeric inputs are scaled; categorical answers are mapped to fixed scores.
            </p>

            <ul className="info-list">
              <li><b>Computer</b> = Computer / 5</li>
              <li><b>English</b> = English / 5</li>
              <li><b>Semester</b> = semester / 8</li>
              <li>
                <b>Income</b> mapped to: Low 0.20 • Lower-middle 0.45 • Upper-middle 0.70 • High 0.90
              </li>
              <li>
                <b>Hometown</b> mapped to: Village 0.30 • Town 0.50 • City 0.70 • Other 0.60
              </li>
              <li>
                <b>Gender</b> mapped to: Female 0.00 • Male 1.00 • Other 0.50
              </li>
            </ul>
          </div>

          <div className="info-block">
            <h3 className="chart-title">2) Academic aggregate</h3>
            <p className="chart-subtitle">
              We merge 4 grades into one score, then normalize it.
            </p>

            <div className="formula-block">
              academic_raw = 0.25·SSC + 0.25·HSC + 0.25·LastGPA + 0.25·OverallGPA{"\n"}
              academic_score = academic_raw / max(academic_raw)
            </div>
          </div>

          <div className="info-block">
            <h3 className="chart-title">3) Self-discipline aggregate (habits)</h3>
            <p className="chart-subtitle">
              Habit answers are mapped to 0–1 and combined with weights.
              Some factors are <b>reversed</b> so “more is worse” becomes a lower score.
            </p>

            <div className="formula-block">
              self_discipline = 0.30·Preparation + 0.25·Attendance + 0.20·Gaming{"\n"}
              {"              "}+ 0.10·(1 − Job) + 0.15·Extra
            </div>

            <ul className="info-list compact">
              <li><b>Gaming</b> is reversed: more gaming → lower score.</li>
              <li><b>Job</b> is reversed in this simplified version: having a job → lower habit score.</li>
            </ul>
          </div>

          <div className="info-block">
            <h3 className="chart-title">What the model actually uses (8 features)</h3>
            <p className="chart-subtitle">
              Your 15 questions are condensed into these 8 features:
            </p>

            <div className="info-grid">
              <div className="info-chip"><b>self_discipline</b><span>from habits</span></div>
              <div className="info-chip"><b>academic_score</b><span>SSC/HSC/Last/Overall</span></div>
              <div className="info-chip"><b>computer_skill</b><span>Computer / 5</span></div>
              <div className="info-chip"><b>english_skill</b><span>English / 5</span></div>
              <div className="info-chip"><b>income_norm</b><span>mapped</span></div>
              <div className="info-chip"><b>hometown_norm</b><span>mapped</span></div>
              <div className="info-chip"><b>gender_norm</b><span>mapped</span></div>
              <div className="info-chip"><b>semester_norm</b><span>semester / 8</span></div>
            </div>
          </div>

          <div className="question-nav" style={{ marginTop: 18 }}>
            <Link to="/" className="btn-ghost small" style={{ textDecoration: "none" }}>
              ← Back
            </Link>
            <Link to="/stem-prediction" className="btn-primary small" style={{ textDecoration: "none" }}>
              Next: Prediction model →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}