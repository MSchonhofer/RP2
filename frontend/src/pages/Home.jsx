// src/pages/Home.jsx
import { useNavigate, Link } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/questionnaire')
  }

  return (
    <div className="app-root">
      {/* kolorowe obłoczki w tle */}
      <div className="bg-orbit bg-orbit-1" />
      <div className="bg-orbit bg-orbit-2" />
      <div className="bg-orbit bg-orbit-3" />

      {/* karta na środku */}
<main className="hero">
        <div className="hero-badge">
          Sukces studencki • Samodyscyplina i wybór kierunku
        </div>

        <h1 className="hero-title">
          <span className="highlight">STEM</span> czy{' '}
          <span className="highlight-alt">non-STEM</span>?
          <br />
          Niech Twoje nawyki zdecydują.
        </h1>

        <p className="hero-subtitle">
          Odpowiedz na krótki kwestionariusz dotyczący Twoich nawyków nauki, 
          grania, pracy i pochodzenia. Na podstawie naszego modelu badawczego 
          oszacujemy Twój wynik samodyscypliny oraz dopasowanie do kierunku STEM lub non-STEM.
        </p>

        {/* główne przyciski */}
        <div className="hero-actions">
          <button className="primary-btn" onClick={handleStart}>
            Rozpocznij kwestionariusz
          </button>

          <Link to="/self-discipline">
            <button className="ghost-btn">
              Dowiedz się więcej o badaniu
            </button>
          </Link>
        </div>

        {/* chipy z dodatkowymi sekcjami */}
        <div className="hero-meta">
          <Link to="/self-discipline" className="meta-chip">
            Wskaźnik samodyscypliny
          </Link>
          <Link to="/stem-prediction" className="meta-chip">
            Predykcja STEM vs non-STEM
          </Link>
          <Link to="/income-performance" className="meta-chip">
            Dochody i czynniki wyników
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
