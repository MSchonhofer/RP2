import { useNavigate } from 'react-router-dom'

function StemPredictionInfo() {
  const navigate = useNavigate()

  return (
    <div className="app-root info-root">
      <div className="hero-bg" />

      <div className="info-card">
        <h2>STEM vs non-STEM prediction</h2>
        <p>
          Using the ResearchInformation3 dataset we model whether a student
          is more likely to choose a STEM or non-STEM major based on their
          habits and background.
        </p>

        <h3>Example model</h3>
        <pre className="formula-block">
{`P(STEM | x) = σ(β0
          + β1 * SelfDiscipline
          + β2 * HSC_score
          + β3 * Gender
          + β4 * FamilyIncome
          + ...)`}
        </pre>

        <p>
          Here σ is the logistic function. Coefficients β are estimated from
          the data. The questionnaire UI is a simplified front-end for such
          a model.
        </p>

        <button className="btn-ghost small" onClick={() => navigate('/')}>
          ← Back to home
        </button>
      </div>
    </div>
  )
}

export default StemPredictionInfo
