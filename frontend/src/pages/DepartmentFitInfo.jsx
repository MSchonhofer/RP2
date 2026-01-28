import { Link } from "react-router-dom";

export default function DepartmentFitInfo() {
  return (
    <div className="app-root">
      <div className="hero-bg" />

      <div className="questionnaire-shell">
        <div className="question-card">
          <div className="hero-badge">Department match • Similarity-based</div>

          <h1 className="questionnaire-title" style={{ marginTop: 10 }}>
            Department fit
          </h1>

          <p
            className="chart-subtitle"
            style={{ marginTop: 8, lineHeight: 1.55, fontSize: 13, maxWidth: 680 }}
          >
            Besides STEM vs Non-STEM, we also show the <b>closest department match</b> from our dataset.
            It’s based on similarity to “typical profiles” (not a recommendation).
          </p>

          <hr style={{ opacity: 0.15, margin: "16px 0" }} />

          {/* GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 12,
            }}
          >
            {/* LEFT: STEPS (compact) */}
            <div
              style={{
                borderRadius: 18,
                padding: 14,
                border: "1px solid rgba(148,163,184,0.20)",
                background:
                  "radial-gradient(circle at top left, rgba(168,85,247,0.14), transparent 55%), rgba(15, 23, 42, 0.55)",
              }}
            >
              <div className="chart-title" style={{ marginBottom: 10 }}>
                How it’s calculated
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <Step
                  emoji="🧩"
                  title="Same 8 features"
                  desc="We convert your answers into the same 8 normalized features used by the model."
                />
                <Step
                  emoji="📌"
                  title="Typical profile per department"
                  desc="For each department we compute an average profile (centroid) from the dataset."
                />
                <Step
                  emoji="🎯"
                  title="Closest match wins"
                  desc="We pick the department whose centroid is most similar to your profile."
                />
              </div>
            </div>

            {/* RIGHT: CONFIDENCE */}
            <div
              style={{
                borderRadius: 18,
                padding: 14,
                border: "1px solid rgba(148,163,184,0.20)",
                background:
                  "radial-gradient(circle at top right, rgba(34,197,94,0.10), transparent 55%), rgba(15, 23, 42, 0.55)",
              }}
            >
              <div className="chart-title" style={{ marginBottom: 10 }}>
                “Confidence”
              </div>

              <div
                style={{
                  background: "rgba(2, 6, 23, 0.55)",
                  border: "1px solid rgba(148,163,184,0.16)",
                  borderRadius: 14,
                  padding: "10px 12px",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                  lineHeight: 1.5,
                  marginBottom: 10,
                  opacity: 0.95,
                }}
              >
                department = argmaxᵈ similarity(x, centroidᵈ)
              </div>

              <p style={{ margin: 0, opacity: 0.86, lineHeight: 1.6, fontSize: 13 }}>
                It’s a <b>similarity score</b> (how close you are to a typical profile).
                Not a guarantee and not career counseling.
              </p>

              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Pill text="Extra insight" />
                <Pill text="Dataset-based" />
                <Pill text="Can be close" />
              </div>
            </div>
          </div>

          <hr style={{ opacity: 0.15, margin: "16px 0" }} />

          {/* MINI NOTE */}
          <div
            style={{
              borderRadius: 16,
              padding: "10px 12px",
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15, 23, 42, 0.45)",
              fontSize: 13,
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            Tip: if two departments are similar in the dataset, the result can be very close.
          </div>

          <div className="question-nav" style={{ marginTop: 18 }}>
            <Link to="/stem-prediction" className="btn-ghost small" style={{ textDecoration: "none" }}>
              ← Back: STEM model
            </Link>
            <Link to="/income-performance" className="btn-primary small" style={{ textDecoration: "none" }}>
              Next: Interpretation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ emoji, title, desc }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr",
        gap: 10,
        alignItems: "start",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 10,
          display: "grid",
          placeItems: "center",
          background: "rgba(148,163,184,0.10)",
          border: "1px solid rgba(148,163,184,0.18)",
          fontSize: 14,
        }}
      >
        {emoji}
      </div>

      <div>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ opacity: 0.86, fontSize: 13, lineHeight: 1.55 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

function Pill({ text }) {
  return (
    <span
      className="meta-chip"
      style={{
        cursor: "default",
        padding: "6px 12px",
        fontSize: 12,
        opacity: 0.95,
      }}
    >
      {text}
    </span>
  );
}