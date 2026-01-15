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

      {/* karta na środku */}
      <main className="hero">
        <div className="hero-badge">
            Research-driven student profiling • STEM & habits
        </div>

        <h1 className="hero-title">
          <span className="highlight">STEM</span> or{" "}
          <span className="highlight-alt">Non-STEM</span>?
          <br />
          Let your habits decide.
        </h1>

        {/* mikro-tagline (robi klimat) */}
        <p className="hero-tagline">From raw habits to interpretable prediction.</p>

        <p className="hero-subtitle">
          Answer a short questionnaire about your study habits, gaming, work and
          background. Based on a research-driven model, we estimate your
          self-discipline index and probability of a STEM-oriented academic path.
        </p>

        {/* główne przyciski */}
        <div className="hero-actions">
          <button className="primary-btn" onClick={handleStart}>
            Start questionnaire
          </button>

          <Link to="/research-info">
            <button className="ghost-btn">Learn about the research</button>
          </Link>
        </div>

        {/* chipy z dodatkowymi sekcjami */}
        <div className="hero-meta">
          <Link to="/self-discipline" className="meta-chip">
            ① Data Processing
          </Link>
          <Link to="/stem-prediction" className="meta-chip">
            ② Prediction Model
          </Link>
          <Link to="/income-performance" className="meta-chip">
            ③ Interpretation
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;