import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ResultScreen from './ResultScreen'

/**
 * Typy pytań:
 * - choice: buttony (single-choice)
 * - scale: buttony 1..5
 * - number: input numeric (float)
 */

const QUESTIONNAIRE = [
  {
    section: 'Personal Information',
    items: [
      {
        id: 'gender',
        type: 'choice',
        label: 'What is your gender?',
        options: ['Male', 'Female', 'Other'],
      },
      {
        id: 'hometown',
        type: 'choice',
        label: 'How would you classify your hometown based on its size/urbanization?',
        options: ['Village', 'Town', 'City', 'Other'],
      },
    ],
  },
  {
    section: 'Previous Academic Performance',
    items: [
      {
        id: 'hsc_score',
        type: 'number',
        label: 'What was your HSC GPA or percentage?',
        placeholder: 'e.g. 4.17',
        min: 0,
        max: 5,
        step: 0.01,
        helper: 'Enter a numeric value (e.g., 3.81).',
      },
      {
        id: 'ssc_score',
        type: 'number',
        label: 'What was your SSC GPA or percentage?',
        placeholder: 'e.g. 3.81',
        min: 0,
        max: 5,
        step: 0.01,
        helper: 'Enter a numeric value (e.g., 4.25).',
      },
    ],
  },
  {
    section: 'Family & Socioeconomic Background',
    items: [
      {
        id: 'income',
        type: 'choice',
        label: 'What is your family income level?',
        options: [
          'Low (Below 15,000)',
          'Lower middle (15,000–30,000)',
          'Upper middle (30,000–50,000)',
          'High (Above 50,000)',
        ],
      },
    ],
  },
  {
    section: 'Technology Access',
    items: [
      {
        id: 'computer_proficiency',
        type: 'scale',
        label: 'What is your proficiency level in computer usage?',
        minLabel: '1 = Low',
        maxLabel: '5 = High',
      },
    ],
  },
  {
    section: 'Study & Preparation Habits',
    items: [
      {
        id: 'preparation_time',
        type: 'choice',
        label: 'How many hours per week do you spend preparing/studying for your courses?',
        options: ['0–1 Hour', '1–3 Hours', 'More than 3 Hours'],
      },
      {
        id: 'gaming_time',
        type: 'choice',
        label: 'How many hours per week do you spend playing video games?',
        options: ['0–1 Hour', '1–3 Hours', 'More than 3 Hours'],
      },
    ],
  },
  {
    section: 'Class Engagement',
    items: [
      {
        id: 'attendance',
        type: 'choice',
        label: 'What is your class attendance rate?',
        options: ['0–50%', '50–80%', '80–100%'],
      },
      {
        id: 'extracurricular',
        type: 'choice',
        label: 'Do you participate in extracurricular activities?',
        options: ['Yes', 'No'],
      },
    ],
  },
  {
    section: 'Work & Language Skills',
    items: [
      {
        id: 'job',
        type: 'choice',
        label: 'Do you currently have a job or paid employment?',
        options: ['Yes', 'No'],
      },
      {
        id: 'english_proficiency',
        type: 'scale',
        label: 'Rate your English language skills on a scale of 1–5.',
        minLabel: '1 = Poor',
        maxLabel: '5 = Excellent',
      },
    ],
  },
  {
    section: 'Course Information',
    items: [
      {
        id: 'semester',
        type: 'choice',
        label: 'Which semester are you currently in?',
        options: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', 'Other'],
      },
      {
        id: 'last_sem_gpa',
        type: 'number',
        label: 'What was your GPA point for the last semester?',
        placeholder: 'e.g. 4.17',
        min: 0,
        max: 5,
        step: 0.01,
      },
      {
        id: 'overall_gpa',
        type: 'number',
        label: 'What is your overall GPA point until now?',
        placeholder: 'e.g. 3.81',
        min: 0,
        max: 5,
        step: 0.01,
      },
    ],
  },
]

// spłaszczamy pytania do kroków
const FLAT_QUESTIONS = QUESTIONNAIRE.flatMap((sec) =>
  sec.items.map((q) => ({ ...q, section: sec.section }))
)

// <-- dopasuj jak masz inaczej
const API_URL = 'http://127.0.0.1:8000/api/evaluate'

// helper: zamienia "4,17" -> 4.17
const toFloat = (val) => {
  if (val === null || val === undefined || val === '') return null
  const s = String(val).replace(',', '.')
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

function Questionnaire() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const current = FLAT_QUESTIONS[step]
  const currentValue = answers[current?.id]
  const total = FLAT_QUESTIONS.length

  const isValidCurrent = useMemo(() => {
    if (!current) return false
    if (current.type === 'choice') return !!currentValue
    if (current.type === 'scale') return Number.isFinite(Number(currentValue))
    if (current.type === 'number') {
      const v = toFloat(currentValue)
      if (v === null) return false
      if (typeof current.min === 'number' && v < current.min) return false
      if (typeof current.max === 'number' && v > current.max) return false
      return true
    }
    return false
  }, [current, currentValue])

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleBack = () => {
    if (step > 0 && !submitting) setStep((s) => s - 1)
  }

  const restart = () => {
    setAnswers({})
    setStep(0)
    setFinished(false)
    setSubmitting(false)
    setResult(null)
    setError('')
  }

  const buildPayload = (a) => ({
    department: a.department ?? null,
    gender: a.gender ?? null,
    hometown: a.hometown ?? null,
    income: a.income ?? null,

    computer_proficiency: a.computer_proficiency ? Number(a.computer_proficiency) : null,

    preparation_time: a.preparation_time ?? null,
    gaming_time: a.gaming_time ?? null,

    attendance: a.attendance ?? null,
    extracurricular: a.extracurricular ?? null,

    job: a.job ?? null,
    english_proficiency: a.english_proficiency ? Number(a.english_proficiency) : null,

    semester: a.semester ?? null,

    hsc_score: toFloat(a.hsc_score),
    ssc_score: toFloat(a.ssc_score),
    last_sem_gpa: toFloat(a.last_sem_gpa),
    overall_gpa: toFloat(a.overall_gpa),
  })

  const handleNext = async () => {
    if (!isValidCurrent || submitting) return

    // ostatni krok => call backend => wynik => finished
    if (step === total - 1) {
      setSubmitting(true)
      setError('')
      setResult(null)

      const payload = buildPayload(answers)

      try {
        const resp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!resp.ok) {
  const errJson = await resp.json().catch(() => null)
  console.error('422 details:', errJson)
  throw new Error(
    errJson?.detail ? JSON.stringify(errJson.detail) : `Backend error: ${resp.status}`
  )
}

        const data = await resp.json()
        setResult(data)
        setFinished(true)
      } catch (e) {
        console.error(e)
        setError('Could not calculate your result. Please try again.')
      } finally {
        setSubmitting(false)
      }

      return
    }

    setStep((s) => s + 1)
  }

  // sekcja: pokazuj nagłówek tylko jak się zmienia
  const sectionLabel = current?.section
  const prevSectionLabel = FLAT_QUESTIONS[step - 1]?.section
  const showSectionHeader = step === 0 || sectionLabel !== prevSectionLabel

  return (
    <div className="app-root">
      <div className="hero-bg" />

      <div className="questionnaire-shell">
        {!finished ? (
          <>
            <h1 className="questionnaire-section-title">Self-discipline questionnaire</h1>

            <div className="questionnaire-header">
              <div>
                <h2 className="questionnaire-title">
                  Question {step + 1} of {total}
                </h2>

                {showSectionHeader && (
                  <div className="questionnaire-category">
                    <span className="questionnaire-category-pill">{sectionLabel}</span>
                  </div>
                )}
              </div>

              <button className="btn-ghost small exit-btn" onClick={() => navigate('/')} disabled={submitting}>
                Exit
              </button>
            </div>

            <div key={step} className="question-card">
              <p className="question-label">{current.label}</p>

              {/* CHOICE */}
              {current.type === 'choice' && (
                <div className="question-options">
                  {current.options.map((opt) => (
                    <button
                      key={opt}
                      className={`option-btn ${currentValue === opt ? 'option-btn-selected' : ''}`}
                      onClick={() => setAnswer(current.id, opt)}
                      disabled={submitting}
                      type="button"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* SCALE 1-5 */}
              {current.type === 'scale' && (
                <div className="scale-wrap">
                  <div className="scale-hint-row">
                    <span className="scale-hint">{current.minLabel}</span>
                    <span className="scale-hint">{current.maxLabel}</span>
                  </div>

                  <div className="scale-buttons">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        className={`option-btn scale-btn ${Number(currentValue) === n ? 'option-btn-selected' : ''}`}
                        onClick={() => setAnswer(current.id, n)}
                        disabled={submitting}
                        type="button"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* NUMBER */}
              {current.type === 'number' && (
                <div className="number-wrap">
                  {current.helper && <p className="number-helper">{current.helper}</p>}

                  <div className="number-input-row">
                    <input
                      className="number-input"
                      type="text"
                      inputMode="decimal"
                      placeholder={current.placeholder || 'e.g. 4.17'}
                      value={currentValue ?? ''}
                      onChange={(e) => setAnswer(current.id, e.target.value)}
                      disabled={submitting}
                    />
                    <span className="number-range">
                      {typeof current.min === 'number' && typeof current.max === 'number'
                        ? `${current.min}–${current.max}`
                        : ''}
                    </span>
                  </div>
                </div>
              )}

              {error && <p className="question-note" style={{ marginTop: 10 }}>{error}</p>}

              <div className="question-nav">
                <button className="btn-ghost small" onClick={handleBack} disabled={step === 0 || submitting}>
                  ← Back
                </button>

                <button className="btn-primary small next-btn" onClick={handleNext} disabled={!isValidCurrent || submitting}>
                  {step === total - 1 && submitting ? 'Calculating…' : 'Next →'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <ResultScreen
            answers={answers}
            result={result}
            onRestart={restart}
            onHome={() => navigate('/')}
          />
        )}
      </div>
    </div>
  )
}

export default Questionnaire