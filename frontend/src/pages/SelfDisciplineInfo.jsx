import { useNavigate } from 'react-router-dom'

function SelfDisciplineInfo() {
  const navigate = useNavigate()

  return (
    <div className="app-root info-root">
      <div className="hero-bg" />

      <div className="info-card">
        <h2>Self-discipline index</h2>
        <p>
          In our research, self-discipline is treated as a combination of
          several observable behaviours: study preparation time, control
          over gaming and class attendance.
        </p>

        <h3>Formula (conceptual)</h3>
        <pre className="formula-block">
{`SelfDiscipline = w1 * StudyPrep_z
                + w2 * Attendance_z
                + w3 * GamingControl_z`}
        </pre>

        <p>
          Each component is first converted into a numerical score and
          standardised (z-score). We then combine them using weights learned
          from the data.
        </p>

        <button className="btn-ghost small" onClick={() => navigate('/')}>
          ← Back to home
        </button>
      </div>
    </div>
  )
}

export default SelfDisciplineInfo
