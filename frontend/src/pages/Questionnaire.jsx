// src/pages/Questionnaire.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Line,
} from 'recharts'

const QUESTIONS = [
  {
    id: 'study_hours',
    label: 'How many hours per day do you usually study outside of class?',
    options: ['0–1 hour', '1–2 hours', '2–3 hours', 'More than 3 hours'],
  },
  {
    id: 'gaming',
    label: 'How much time do you spend on gaming per day?',
    options: ['0–1 hour', '2–3 hours', 'More than 3 hours'],
  },
  {
    id: 'attendance',
    label: 'How often do you attend classes?',
    options: ['Below 60%', '60–80%', 'Above 80%'],
  },
  // --- NOWE PYTANIE O MATEMATYKĘ ---
  {
    id: 'math_performance',
    label: 'How would you rate your math performance in high school / entrance exams?',
    options: [
      'Below average',
      'Around average',
      'Above average',
      'Top of the class',
    ],
  },
  {
    id: 'job',
    label: 'Do you currently have a part-time or full-time job?',
    options: ['No', 'Yes, part-time', 'Yes, full-time'],
  },
  {
    id: 'income',
    label: 'How would you describe your family income?',
    options: ['Low', 'Lower middle', 'Upper middle', 'High'],
  },
  {
    id: 'gender',
    label: 'What is your gender?',
    options: ['Woman', 'Man', 'Non-binary / other', 'Prefer not to say'],
  },
  {
    id: 'department',
    label: 'Which type of programme best describes your current studies?',
    options: [
      'STEM (science / engineering / technology / maths)',
      'Business / economics / management',
      'Humanities / social sciences / arts',
      'Other / mixed programme',
    ],
  },
  {
    id: 'hometown',
    label: 'Where did you mostly live before university?',
    options: [
      'Rural area / village',
      'Small town',
      'Medium-size city',
      'Large city / metropolitan area',
    ],
  },
]

const API_URL = 'http://127.0.0.1:8000/api/evaluate'

function Questionnaire() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [animatedScore, setAnimatedScore] = useState(0)

  const navigate = useNavigate()

  const currentQuestion = QUESTIONS[step]
  const currentAnswer = answers[currentQuestion?.id]

  const handleOptionClick = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = async () => {
    if (!currentAnswer || submitting) return

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: currentAnswer,
    }

    // ostatni krok -> wywołanie backendu
    if (step === QUESTIONS.length - 1) {
      setSubmitting(true)
      setAnswers(updatedAnswers)

      try {
        const resp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            study_hours: updatedAnswers.study_hours,
            gaming: updatedAnswers.gaming,
            attendance: updatedAnswers.attendance,
            math_performance: updatedAnswers.math_performance,
            job: updatedAnswers.job,
            income: updatedAnswers.income,
            gender: updatedAnswers.gender,
            department: updatedAnswers.department,
            hometown: updatedAnswers.hometown,
          }),
        })

        if (!resp.ok) {
          console.error('Backend error', resp.status)
        } else {
          const data = await resp.json()
          setResult(data)
        }
      } catch (err) {
        console.error('Error calling backend', err)
      } finally {
        setSubmitting(false)
        setFinished(true)
      }
    } else {
      setAnswers(updatedAnswers)
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (step > 0 && !submitting) setStep((s) => s - 1)
  }

  const restart = () => {
    setAnswers({})
    setStep(0)
    setFinished(false)
    setResult(null)
    setAnimatedScore(0)
  }

  // animacja wzrostu paska self-discipline
  useEffect(() => {
    if (finished && result) {
      const target = result.self_discipline_score
      const duration = 900
      const startTime = performance.now()

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const value = target * progress
        setAnimatedScore(value)
        if (progress < 1) {
          requestAnimationFrame(tick)
        }
      }

      requestAnimationFrame(tick)
    }
  }, [finished, result])

  const stemBadge =
    result && result.stem_fit_probability >= 0.5 ? 'STEM' : 'non-STEM'

  const breakdownData =
    result
      ? [
          { name: 'Study', value: result.study_component },
          { name: 'Attendance', value: result.attendance_component },
          { name: 'Gaming', value: result.gaming_component },
          { name: 'Work', value: result.job_component },
        ]
      : []

  return (
    <div className="app-root">
      <div className="hero-bg" />

      <div className="questionnaire-shell">
        {!finished ? (
          <>
            <h1 className="questionnaire-section-title">
              Self-discipline questionnaire
            </h1>

            <div className="questionnaire-header">
              <div>
                <h2 className="questionnaire-title">
                  Question {step + 1} of {QUESTIONS.length}
                </h2>
              </div>

              <button
                className="btn-ghost small exit-btn"
                onClick={() => navigate('/')}
                disabled={submitting}
              >
                Exit
              </button>
            </div>

            <div key={step} className="question-card">
              <p className="question-label">{currentQuestion.label}</p>

              <div className="question-options">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    className={`option-btn ${
                      currentAnswer === opt ? 'option-btn-selected' : ''
                    }`}
                    onClick={() => handleOptionClick(opt)}
                    disabled={submitting}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="question-nav">
                <button
                  className="btn-ghost small"
                  onClick={handleBack}
                  disabled={step === 0 || submitting}
                >
                  ← Back
                </button>

                <button
                  className="btn-primary small next-btn"
                  onClick={handleNext}
                  disabled={!currentAnswer || submitting}
                >
                  {step === QUESTIONS.length - 1 && submitting
                    ? 'Calculating...'
                    : 'Next →'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="question-card">
            <h2 className="questionnaire-title">Your result</h2>

            {result ? (
              <>
                {/* główny pasek self-discipline */}
                <div className="score-bar-wrapper">
                  <div className="score-bar-label-row">
                    <span>Self-discipline score</span>
                    <span className="score-bar-number">
                      {animatedScore.toFixed(0)}%
                    </span>
                  </div>
                  <div className="score-bar-track">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${Math.min(animatedScore, 100)}%` }}
                    />
                  </div>
                </div>

                {/* STEM / non-STEM highlight */}
                <div className="stem-highlight">
                  <span className="stem-pill">{stemBadge}</span>
                  <span className="stem-desc">
                    STEM fit:{' '}
                    <strong>
                      <span className="stem-percent">
                        {(result.stem_fit_probability * 100).toFixed(0)}%
                      </span>{' '}
                      – {result.stem_fit_label}
                    </strong>
                  </span>
                </div>

                {/* wykres breakdown */}
                <div className="chart-card">
                  <h3 className="chart-title">Breakdown by habits</h3>
                  <p className="chart-subtitle">
                    Each point shows how strong this factor is in your
                    self-discipline profile.
                  </p>

                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart
                        data={breakdownData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        //style={{ background: 'transparent' }} // brak jasnego tła SVG
                      >
                        {/* bez CartesianGrid – czyściutki wykres */}
                        <XAxis
                          dataKey="name"
                          stroke="#9ca3af"
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: '#4b5563' }}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          tick={{ fontSize: 11 }}
                          axisLine={{ stroke: '#4b5563' }}
                          tickFormatter={(v) => `${v.toFixed(0)}%`}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            background: '#020617',
                            border: '1px solid rgba(148,163,184,0.8)',
                            borderRadius: 10,
                            fontSize: 12,
                            color: '#e5e7eb',
                          }}
                          labelStyle={{ color: '#e5e7eb', marginBottom: 4 }}
                          formatter={(value) => [
                            `${Number(value).toFixed(1)}%`,
                            'Score',
                          ]}
                        />
                        <Bar
                          dataKey="value"
                          fill="#a855f7"
                          radius={[6, 6, 0, 0]}
                          activeBar={{ fill: '#a855f7' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <p className="question-note">
                We couldn&apos;t fetch the calculated score. Please try again
                later.
              </p>
            )}

            <div className="question-nav">
              <button className="btn-ghost small" onClick={restart}>
                Restart questionnaire
              </button>
              <button
                className="btn-primary small"
                onClick={() => navigate('/')}
              >
                Back to home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Questionnaire
