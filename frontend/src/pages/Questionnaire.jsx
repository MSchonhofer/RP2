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
    section: 'Informacje osobiste',
    items: [
      {
        id: 'Plec',
        type: 'choice',
        label: 'Jaka jest Twoja płeć?',
        options: ['Mężczyzna', 'Kobieta', 'Inna'],
      },
      {
        id: 'Pochodzenie',
        type: 'choice',
        label: 'Jak sklasyfikowałbyś/-aś swoje miejsce pochodzenia?',
        options: ['Wieś', 'Małe miasto', 'Miasto', 'Inne'],
      },
    ],
  },
  {
    section: 'Wyniki z egzaminów',
    items: [
      {
        id: 'Matura',
        type: 'number',
        label: 'Jaki wynik uzyskałeś/-aś z matury? (w procentach)',
        placeholder: 'np. 85',
        min: 0,
        max: 100,
        step: 1,
        helper: 'Podaj wartość w procentach (0-100).',
      },
      {
        id: 'Egzamin8',
        type: 'number',
        label: 'Jaki wynik uzyskałeś/-aś z egzaminu ósmoklasisty? (w procentach)',
        placeholder: 'np. 78',
        min: 0,
        max: 100,
        step: 1,
        helper: 'Podaj wartość w procentach (0-100).',
      },
    ],
  },
  {
    section: 'Tło rodzinne i ekonomiczne',
    items: [
      {
        id: 'Dochody',
        type: 'choice',
        label: 'Jaki jest miesięczny dochód Twojej rodziny?',
        options: [
          'Niskie (poniżej 3000 PLN)',
          'Niżej średnie (3000-6000 PLN)',
          'Wyżej średnie (6000-10000 PLN)',
          'Wysokie (powyżej 10000 PLN)',
        ],
      },
    ],
  },
  {
    section: 'Umiejętności komputerowe',
    items: [
      {
        id: 'Komputer',
        type: 'scale',
        label: 'Oceń swój poziom umiejętności komputerowych.',
        minLabel: '1 = Niski',
        maxLabel: '5 = Wysoki',
      },
    ],
  },
  {
    section: 'Nawyki nauki i przygotowania',
    items: [
      {
        id: 'Przygotowanie',
        type: 'choice',
        label: 'Ile godzin dziennie poświęcasz na naukę i przygotowanie do zajęć?',
        options: ['0-1 godzina', '1-2 godziny', '2-3 godziny', 'Więcej niż 3 godziny'],
      },
      {
        id: 'Gry',
        type: 'choice',
        label: 'Ile godzin dziennie poświęcasz na granie w gry komputerowe?',
        options: ['0-1 godzina', '1-3 godziny', 'Więcej niż 3 godziny'],
      },
    ],
  },
  {
    section: 'Zaangażowanie w zajęcia',
    items: [
      {
        id: 'Frekwencja',
        type: 'choice',
        label: 'Jaka jest Twoja frekwencja na zajęciach?',
        options: ['0-50%', '50-80%', '80-100%'],
      },
      {
        id: 'Dodatkowe',
        type: 'choice',
        label: 'Czy uczestniczysz w zajęciach dodatkowych/pozalekcyjnych?',
        options: ['Tak', 'Nie'],
      },
    ],
  },
  {
    section: 'Praca i umiejętności językowe',
    items: [
      {
        id: 'Praca',
        type: 'choice',
        label: 'Czy obecnie masz płatną pracę?',
        options: ['Tak', 'Nie'],
      },
      {
        id: 'Angielski',
        type: 'scale',
        label: 'Oceń swój poziom znajomości języka angielskiego.',
        minLabel: '1 = Słaby',
        maxLabel: '5 = Doskonały',
      },
    ],
  },
  {
    section: 'Informacje o studiach',
    items: [
      {
        id: 'Semestr',
        type: 'choice',
        label: 'Na którym semestrze obecnie studiujesz?',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', 'Inny'],
      },
      {
        id: 'Ostatnia',
        type: 'number',
        label: 'Jaka była Twoja średnia ocen z ostatniego semestru?',
        placeholder: 'np. 4.5',
        min: 2,
        max: 5,
        step: 0.1,
        helper: 'Podaj wartość w skali 2.0-5.0.',
      },
      {
        id: 'Srednia',
        type: 'number',
        label: 'Jaka jest Twoja ogólna średnia ocen ze studiów?',
        placeholder: 'np. 4.2',
        min: 2,
        max: 5,
        step: 0.1,
        helper: 'Podaj wartość w skali 2.0-5.0.',
      },
    ],
  },
]

// spłaszczamy pytania do kroków
const FLAT_QUESTIONS = QUESTIONNAIRE.flatMap((sec) =>
  sec.items.map((q) => ({ ...q, section: sec.section }))
)

// <-- dopasuj URL do swojego API modelu
const API_URL = 'http://localhost:5001/predict'

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
    // Format zgodny z polish_adapter.py
    Plec: a.Plec ?? null,
    Pochodzenie: a.Pochodzenie ?? null,
    Dochody: a.Dochody ?? null,
    Komputer: a.Komputer ? Number(a.Komputer) : null,
    Przygotowanie: a.Przygotowanie ?? null,
    Gry: a.Gry ?? null,
    Frekwencja: a.Frekwencja ?? null,
    Dodatkowe: a.Dodatkowe ?? null,
    Praca: a.Praca ?? null,
    Angielski: a.Angielski ? Number(a.Angielski) : null,
    Semestr: a.Semestr ?? null,
    Matura: toFloat(a.Matura),
    Egzamin8: toFloat(a.Egzamin8),
    Ostatnia: toFloat(a.Ostatnia),
    Srednia: toFloat(a.Srednia),
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
          console.error('Błąd API:', errJson)
          throw new Error(
            errJson?.detail ? JSON.stringify(errJson.detail) : `Błąd backendu: ${resp.status}`
          )
        }

        const data = await resp.json()
        setResult(data)
        setFinished(true)
      } catch (e) {
        console.error(e)
        setError('Nie udało się obliczyć wyniku. Spróbuj ponownie.')
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
            <h1 className="questionnaire-section-title">Kwestionariusz samodyscypliny</h1>

            <div className="questionnaire-header">
              <div>
                <h2 className="questionnaire-title">
                  Pytanie {step + 1} z {total}
                </h2>

                {showSectionHeader && (
                  <div className="questionnaire-category">
                    <span className="questionnaire-category-pill">{sectionLabel}</span>
                  </div>
                )}
              </div>

              <button className="btn-ghost small exit-btn" onClick={() => navigate('/')} disabled={submitting}>
                Wyjdź
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
                  ← Wstecz
                </button>

                <button className="btn-primary small next-btn" onClick={handleNext} disabled={!isValidCurrent || submitting}>
                  {step === total - 1 && submitting ? 'Obliczanie…' : 'Dalej →'}
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