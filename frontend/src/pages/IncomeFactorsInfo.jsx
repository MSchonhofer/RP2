import { useNavigate } from 'react-router-dom'

function IncomeFactorsInfo() {
  const navigate = useNavigate()

  return (
    <div className="app-root info-root">
      <div className="hero-bg" />

      <div className="info-card">
        <h2>Income & performance factors</h2>
        <p>
          Besides self-discipline, we also explore how family income and
          previous results (SSC/HSC scores) relate to university CGPA and
          field choice.
        </p>

        <h3>Example regression</h3>
        <pre className="formula-block">
{`CGPA = α0
     + α1 * SelfDiscipline
     + α2 * HSC_score
     + α3 * FamilyIncome_level
     + ε`}
        </pre>

        <p>
          These models allow us to test whether self-discipline alone is
          sufficient to explain success, or whether socio-economic and
          academic background play a stronger role.
        </p>

        <button className="btn-ghost small" onClick={() => navigate('/')}>
          ← Back to home
        </button>
      </div>
    </div>
  )
}

export default IncomeFactorsInfo
