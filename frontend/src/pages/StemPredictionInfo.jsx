import { useNavigate } from 'react-router-dom'

function StemPredictionInfo() {
  const navigate = useNavigate()

  return (
    <div className="app-root info-root">
      <div className="hero-bg" />

      <div className="info-card">
        <h2>Predykcja STEM vs non-STEM</h2>
        <p>
          Używając zbioru danych badawczych modelujemy, czy student
          jest bardziej skłonny do wyboru kierunku STEM czy non-STEM
          na podstawie jego nawyków i pochodzenia.
        </p>

        <h3>Przykładowy model</h3>
        <pre className="formula-block">
{`P(STEM | x) = σ(β0
          + β1 * Samodyscyplina
          + β2 * Wynik_Matury
          + β3 * Płeć
          + β4 * Dochód_Rodziny
          + ...)`}
        </pre>

        <p>
          Gdzie σ to funkcja logistyczna. Współczynniki β są szacowane
          na podstawie danych. Interfejs kwestionariusza to uproszczony
          frontend dla takiego modelu.
        </p>

        <button className="btn-ghost small" onClick={() => navigate('/')}>
          ← Powrót do strony głównej
        </button>
      </div>
    </div>
  )
}

export default StemPredictionInfo
