import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts'

function BreakdownChart({ data }) {
  // data może być:
  // 1) obiektem: { study: 60, attendance: 80, gaming: 40, work: 55 }
  // 2) tablicą obiektów: [{name:'Study', value: 60}, ...]
  // 3) null/undefined -> pokazujemy pusty stan

  let chartData = []

  if (Array.isArray(data)) {
    chartData = data
  } else if (data && typeof data === 'object') {
    const map = [
      { key: 'study', name: 'Study' },
      { key: 'attendance', name: 'Attendance' },
      { key: 'gaming', name: 'Gaming' },
      { key: 'work', name: 'Work' },
      { key: 'academics', name: 'Academics' }, // jeśli kiedyś dodasz
    ]
    chartData = map
      .filter((m) => data[m.key] !== undefined && data[m.key] !== null)
      .map((m) => ({ name: m.name, value: Number(data[m.key]) }))
  }

  if (!chartData.length) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Breakdown</h3>
        <p className="chart-subtitle">No breakdown data returned.</p>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Breakdown by habits</h3>
      <p className="chart-subtitle">
        Higher value means a stronger contribution to your profile.
      </p>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: '#4b5563' }}
              tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
            />
            <RechartsTooltip
              contentStyle={{
                background: '#020617',
                border: '1px solid rgba(148,163,184,0.8)',
                borderRadius: 10,
                fontSize: 12,
                color: '#e5e7eb',
              }}
              labelStyle={{ color: '#e5e7eb', marginBottom: 4 }}
              formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Score']}
            />
            <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ResultScreen({ result, onRestart, onHome }) {
  if (!result) {
    return (
      <div className="question-card">
        <p>Calculating results…</p>
      </div>
    )
  }

  // self_discipline_score może być 0..1 albo 0..100 – zabezpieczenie:
  const sd =
    result.self_discipline_score > 1
      ? result.self_discipline_score
      : result.self_discipline_score * 100

  const stemProb =
    result.stem_fit_probability > 1
      ? result.stem_fit_probability / 100
      : result.stem_fit_probability

  // breakdown: obsłuż oba formaty:
  // A) result.components
  // B) stare pola: study_component / attendance_component / gaming_component / job_component
  const breakdown =
    result.components ??
    {
      study: result.study_component,
      attendance: result.attendance_component,
      gaming: result.gaming_component,
      work: result.job_component,
    }

  return (
    <div className="question-card">
      <h2 className="questionnaire-title">Your result</h2>

      {/* SCORE */}
      <div className="score-bar-wrapper">
        <div className="score-bar-label-row">
          <span>Self-discipline score</span>
          <span className="score-bar-number">{sd.toFixed(0)}%</span>
        </div>

        <div className="score-bar-track">
          <div className="score-bar-fill" style={{ width: `${Math.min(sd, 100)}%` }} />
        </div>
      </div>

      {/* STEM */}
      <div className="stem-highlight">
        <span className="stem-pill">{stemProb >= 0.5 ? 'STEM' : 'NON-STEM'}</span>

        <span className="stem-desc">
          STEM fit:{' '}
          <strong>
            <span className="stem-percent">{(stemProb * 100).toFixed(0)}%</span> –{' '}
            {result.stem_fit_label}
          </strong>
        </span>
      </div>

      {/* WYKRES */}
      <BreakdownChart data={breakdown} />

      <div className="question-nav">
        <button className="btn-ghost small" onClick={onRestart}>
          Restart questionnaire
        </button>
        <button className="btn-primary small" onClick={onHome}>
          Back to home
        </button>
      </div>
    </div>
  )
}

export default ResultScreen