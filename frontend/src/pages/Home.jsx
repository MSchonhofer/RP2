// src/pages/Home.jsx
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/questionnaire");
  };

  return (
    <div className="app-root">
      {/* kolorowe obłoczki w tle */}
      <div className="bg-orbit bg-orbit-1" />
      <div className="bg-orbit bg-orbit-2" />
      <div className="bg-orbit bg-orbit-3" />

      <main className="hero">
        <div className="hero-badge">Student Success • Self-discipline, STEM & department match</div>

        <h1 className="hero-title">
          <span className="highlight">STEM</span> or <span className="highlight-alt">Non-STEM</span>?
          <br />
          Let your habits decide.
        </h1>

        <p className="hero-subtitle">
          Answer a short questionnaire about your study habits, gaming, work and background.
          Based on our research model, we estimate your self-discipline score, STEM fit,
          and a best-matching department profile.
        </p>

        <div className="hero-actions">
          <button className="primary-btn" onClick={handleStart}>
            Start questionnaire
          </button>

          <Link to="/research-info">
            <button className="ghost-btn">Learn about the research</button>
          </Link>
        </div>

        <div className="hero-meta">
          <Link to="/self-discipline" className="meta-chip">
            Data processing
          </Link>
          <Link to="/stem-prediction" className="meta-chip">
            STEM model
          </Link>
          <Link to="/department-fit" className="meta-chip">
            Department match
          </Link>
          <Link to="/income-performance" className="meta-chip">
            Interpretation
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;