import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import FeedbackPrompt from "./FeedbackPrompt";

/**
 * Accepts:
 * 1) components as ARRAY: [{ name: "Self-discipline", value: 0.64 }, ...]
 * 2) components as OBJECT: { "Self-discipline": 0.64, "Academic": 0.71, ... }
 */
function BreakdownChart({ components }) {
  const chartData = useMemo(() => {
    if (!components) return [];

    // Case 1: array of {name, value}
    if (Array.isArray(components)) {
      return components
        .map((c) => ({
          name: String(c?.name ?? ""),
          value: Number(c?.value),
        }))
        .filter((d) => d.name && Number.isFinite(d.value));
    }

    // Case 2: object map {name: value}
    if (typeof components === "object") {
      return Object.entries(components)
        .map(([k, v]) => ({
          name: String(k),
          value: Number(v),
        }))
        .filter((d) => d.name && Number.isFinite(d.value));
    }

    return [];
  }, [components]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Breakdown by habits</h3>
      <p className="chart-subtitle">
        This chart shows how strong each factor is in your profile.
      </p>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#4b5563" }}
              tickLine={{ stroke: "#4b5563" }}
            />
            <YAxis
  stroke="#9ca3af"
  tick={{ fontSize: 11 }}
  axisLine={{ stroke: "#4b5563" }}
  tickLine={{ stroke: "#4b5563" }}
  domain={[0, 100]}
  tickFormatter={(v) => `${Math.round(v)}%`}
/>

<RechartsTooltip
  contentStyle={{
    background: "#020617",
    border: "1px solid rgba(148,163,184,0.8)",
    borderRadius: 10,
    fontSize: 12,
    color: "#e5e7eb",
  }}
  labelStyle={{ color: "#e5e7eb", marginBottom: 4 }}
  formatter={(value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return ["—", "Score"];
    return [`${Math.round(num)}%`, "Score"];
  }}
/>

            <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ResultScreen({ result, onRestart, onHome }) {
  if (!result) {
    return (
      <div className="question-card">
        <p>Calculating results…</p>
      </div>
    );
  }

  const stemBadge = result.stem_fit_probability >= 0.5 ? "STEM" : "NON-STEM";

  return (
    <div className="question-card">
      <h2 className="questionnaire-title">Your result</h2>

      {/* SCORE */}
      <div className="score-bar-wrapper">
        <div className="score-bar-label-row">
          <span>Self-discipline score</span>
          <span className="score-bar-number">
            {Math.round(result.self_discipline_score * 100)}%
          </span>
        </div>

        <div className="score-bar-track">
          <div
            className="score-bar-fill"
            style={{ width: `${Math.max(0, Math.min(1, result.self_discipline_score)) * 100}%` }}
          />
        </div>
      </div>

      {/* STEM */}
      <div className="stem-highlight">
        <span className="stem-pill">{stemBadge}</span>

        <span className="stem-desc">
          STEM fit:{" "}
          <strong>
            <span className="stem-percent">
              {Math.round(result.stem_fit_probability * 100)}%
            </span>{" "}
            – {result.stem_fit_label}
          </strong>
        </span>
      </div>

      {/* CHART */}
      <BreakdownChart components={result.components} />

      <div className="question-nav">
        <button className="btn-ghost small" onClick={onRestart}>
          Restart questionnaire
        </button>
        <button className="btn-primary small" onClick={onHome}>
          Back to home
        </button>
      </div>
            <FeedbackPrompt
        formUrl={import.meta.env.VITE_FEEDBACK_FORM_URL}
        delayMs={15000}
      />
    </div>
  );
}