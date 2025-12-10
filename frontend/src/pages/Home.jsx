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
          Student Success • Self-discipline & STEM choice
        </div>

        <h1 className="hero-title">
          <span className="highlight">STEM</span> or{' '}
          <span className="highlight-alt">Non-STEM</span>?
          <br />
          Let your habits decide.
        </h1>

        <p className="hero-subtitle">
          Answer a short questionnaire about your study habits, gaming, work and
          background. Based on our research model, we estimate your self-discipline
          score and how well you fit a STEM vs non-STEM path.
        </p>

        {/* główne przyciski */}
        <div className="hero-actions">
          <button className="primary-btn" onClick={handleStart}>
            Start questionnaire
          </button>

          <Link to="/self-discipline">
            <button className="ghost-btn">
              Learn about the research
            </button>
          </Link>
        </div>

        {/* chipy z dodatkowymi sekcjami */}
        <div className="hero-meta">
          <Link to="/self-discipline" className="meta-chip">
            Self-discipline index
          </Link>
          <Link to="/stem-prediction" className="meta-chip">
            STEM vs non-STEM prediction
          </Link>
          <Link to="/income-performance" className="meta-chip">
            Income & performance factors
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
