// src/pages/Questionnaire.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultScreen from "./ResultScreen";

# deployment
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = API_BASE ? `${API_BASE}/api/evaluate` : null;

const QUESTIONS = [
  { section: "Personal information", id: "gender", type: "choice", label: "What is your gender?", options: ["Male", "Female", "Other"] },
  { section: "Personal information", id: "hometown", type: "choice", label: "How would you classify your hometown?", options: ["Village", "Town", "City", "Other"] },

  {
    section: "Family & socioeconomic background",
    id: "income",
    type: "choice",
    label: "What is your monthly family income (net, in PLN)?",
    options: [
      "Low (Below 7,000 PLN)",
      "Lower middle (7,000-10,000 PLN)",
      "Upper middle (10,000-13,000 PLN)",
      "High (Above 13,000 PLN)",
    ],
  },

  { section: "Previous academic performance", id: "ssc", type: "number", label: "Primary school average grade (1–6)", min: 1, max: 6, step: 0.01, placeholder: "e.g. 4.5" },
  { section: "Previous academic performance", id: "hsc", type: "number", label: "High school average grade (1–6)", min: 1, max: 6, step: 0.01, placeholder: "e.g. 4.8" },

  { section: "Technology access", id: "computer", type: "scale", label: "Computer usage proficiency (1–5)", min: 1, max: 5 },

  { section: "Study & preparation habits", id: "preparation", type: "choice", label: "How many hours per week do you spend preparing/studying?", options: ["0-1 Hour", "2-3 Hours", "More than 3 Hours"] },
  { section: "Study & preparation habits", id: "gaming", type: "choice", label: "How many hours per week do you spend playing video games?", options: ["0-1 Hour", "2-3 Hours", "More than 3 Hours"] },

  { section: "Class engagement", id: "attendance", type: "choice", label: "What is your class attendance rate?", options: ["Below 40%", "40%-59%", "60%-79%", "80%-100%"] },
  { section: "Class engagement", id: "extra", type: "choice", label: "Do you participate in extracurricular activities? (sports, music, student clubs)", options: ["Yes", "No"] },

  { section: "Work & language skills", id: "job", type: "choice", label: "Do you currently have a paid job?", options: ["Yes", "No"] },
  { section: "Work & language skills", id: "english", type: "scale", label: "English proficiency (1–5)", min: 1, max: 5 },

  { section: "Course information", id: "semester", type: "choice", label: "Which semester are you currently in?", options: ["1", "2", "3", "4", "5", "6", "7", "8"] },
  { section: "Course information", id: "last_gpa", type: "number", label: "Average grade from last semester (all subjects, 2.0–5.0)", min: 2.0, max: 5.0, step: 0.01, placeholder: "e.g. 4.25" },
  { section: "Course information", id: "overall_gpa", type: "number", label: "Overall average grade from all semesters (2.0–5.0)", min: 2.0, max: 5.0, step: 0.01, placeholder: "e.g. 4.10" },
];

export default function Questionnaire() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const q = QUESTIONS[step];
  const current = answers[q?.id];

  const setValue = (val) => setAnswers((prev) => ({ ...prev, [q.id]: val }));

  const canGoNext = () => {
    if (!q) return false;
    if (q.type === "number") {
      return current !== undefined && current !== "" && !Number.isNaN(Number(current));
    }
    return current !== undefined && current !== "";
  };

  const handleBack = () => {
    if (step > 0 && !submitting) setStep((s) => s - 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setFinished(false);
    setSubmitting(false);
    setResult(null);
    setErrorMsg("");
  };

  const handleNext = async () => {
    if (!canGoNext() || submitting) return;

    // ważne: dopisz aktualną odpowiedź zanim przejdziesz dalej / wyślesz
    const updatedAnswers = { ...answers, [q.id]: current };
    setAnswers(updatedAnswers);

    // ostatnie pytanie -> call do backendu
    if (step === QUESTIONS.length - 1) {
      setSubmitting(true);
      setErrorMsg("");

      const payload = {
        Gender: updatedAnswers.gender,
        Hometown: updatedAnswers.hometown,
        Income: updatedAnswers.income, // Now Polish category string

        SSC: Number(updatedAnswers.ssc), // Polish grade 1-6
        HSC: Number(updatedAnswers.hsc), // Polish grade 1-6

        Computer: Number(updatedAnswers.computer),
        Preparation: updatedAnswers.preparation,
        Gaming: updatedAnswers.gaming,
        Attendance: updatedAnswers.attendance,
        Job: updatedAnswers.job,
        Extra: updatedAnswers.extra,
        English: Number(updatedAnswers.english),

        // backend chce STRING (bo masz tam regex/parse)
        Semester: String(updatedAnswers.semester),

        Last: Number(updatedAnswers.last_gpa), // Polish grade 2-5
        Overall: Number(updatedAnswers.overall_gpa), // Polish grade 2-5
      };

      try {
        const resp = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          const txt = await resp.text();
          console.error("Backend error:", resp.status, txt);
          setErrorMsg("Could not calculate your result. Please try again.");
          setFinished(true);
          setSubmitting(false);
          return;
        }

        const data = await resp.json();
        setResult(data);
        setFinished(true);
        setSubmitting(false);
      } catch (e) {
        console.error(e);
        setErrorMsg("Could not calculate your result. Please try again.");
        setFinished(true);
        setSubmitting(false);
      }

      return;
    }

    // normalny next
    setStep((s) => s + 1);
  };

  if (finished) {
    return (
      <div className="app-root">
        <div className="hero-bg" />
        <div className="questionnaire-shell">
          {errorMsg ? (
            <div className="question-card">
              <p>{errorMsg}</p>
              <div className="question-nav">
                <button className="btn-ghost small" onClick={restart}>
                  Restart questionnaire
                </button>
                <button className="btn-primary small" onClick={() => navigate("/")}>
                  Back to home
                </button>
              </div>
            </div>
          ) : (
            <ResultScreen
              result={result}
              onRestart={restart}
              onHome={() => navigate("/")}
            />
          )}
        </div>
      </div>
    );
  }

  const showSection = step === 0 || QUESTIONS[step - 1].section !== q.section;

  return (
    <div className="app-root">
      <div className="hero-bg" />

      <div className="questionnaire-shell">
        <h1 className="questionnaire-section-title">Self-discipline questionnaire</h1>

        <div className="questionnaire-header">
          <div>
            <h2 className="questionnaire-title">
              Question {step + 1} of {QUESTIONS.length}
            </h2>
          </div>

          <button className="btn-ghost small exit-btn" onClick={() => navigate("/")}>
            Exit
          </button>
        </div>

        <div className="question-card">
          {showSection && (
            <div style={{ marginBottom: 10, opacity: 0.9 }}>
              <span className="questionnaire-title">{q.section}</span>
            </div>
          )}

          <p className="question-label">{q.label}</p>

          {/* CHOICE */}
          {q.type === "choice" && (
            <div className="question-options">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  className={`option-btn ${current === opt ? "option-btn-selected" : ""}`}
                  onClick={() => setValue(opt)}
                  disabled={submitting}
                  type="button"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* SCALE */}
          {q.type === "scale" && (
            <div className="question-options">
              {Array.from({ length: q.max - q.min + 1 }, (_, i) => q.min + i).map((n) => (
                <button
                  key={n}
                  className={`option-btn ${Number(current) === n ? "option-btn-selected" : ""}`}
                  onClick={() => setValue(n)}
                  disabled={submitting}
                  type="button"
                >
                  {n}
                </button>
              ))}
            </div>
          )}

          {/* NUMBER */}
          {q.type === "number" && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <input
                value={current ?? ""}
                onChange={(e) => setValue(e.target.value)}
                type="number"
                min={q.min}
                max={q.max}
                step={q.step}
                placeholder={q.placeholder}
                disabled={submitting}
                style={{
                  width: 240,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(148,163,184,0.45)",
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#e5e7eb",
                  outline: "none",
                }}
              />
            </div>
          )}

          <div className="question-nav">
            <button
              className="btn-ghost small"
              onClick={handleBack}
              disabled={step === 0 || submitting}
              type="button"
            >
              ← Back
            </button>

            <button
              className="btn-primary small next-btn"
              onClick={handleNext}
              disabled={!canGoNext() || submitting}
              type="button"
            >
              {step === QUESTIONS.length - 1 ? (submitting ? "Calculating..." : "Finish →") : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}