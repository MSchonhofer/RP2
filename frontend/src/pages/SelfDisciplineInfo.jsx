import { useNavigate } from 'react-router-dom'

function SelfDisciplineInfo() {
  const navigate = useNavigate()

  return (
    <div className="app-root info-root">
      <div className="hero-bg" />

      <div className="info-card">
        <h2>Wskaźnik samodyscypliny</h2>
        <p>
          W naszym badaniu samodyscyplina jest traktowana jako kombinacja
          kilku obserwowalnych zachowań: czasu poświęconego na naukę,
          kontroli nad graniem w gry oraz frekwencji na zajęciach.
        </p>

        <h3>Formuła (koncepcyjna)</h3>
        <pre className="formula-block">
{`Samodyscyplina = w1 * Nauka_z
                + w2 * Frekwencja_z
                + w3 * KontrolaGier_z`}
        </pre>

        <p>
          Każdy komponent jest najpierw przekształcany na wynik numeryczny
          i standaryzowany (z-score). Następnie łączymy je za pomocą wag
          wyuczonych z danych.
        </p>

        <button className="btn-ghost small" onClick={() => navigate('/')}>
          ← Powrót do strony głównej
        </button>
      </div>
    </div>
  )
}

export default SelfDisciplineInfo
