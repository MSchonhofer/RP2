import { useNavigate } from 'react-router-dom'

function IncomeFactorsInfo() {
  const navigate = useNavigate()

  return (
    <div className="app-root info-root">
      <div className="hero-bg" />

      <div className="info-card">
        <h2>Dochody i czynniki wyników</h2>
        <p>
          Oprócz samodyscypliny badamy również, jak dochody rodziny i
          wcześniejsze wyniki (egzamin ósmoklasisty/matura) odnoszą się
          do średniej ocen na studiach i wyboru kierunku.
        </p>

        <h3>Przykładowa regresja</h3>
        <pre className="formula-block">
{`Średnia = α0
        + α1 * Samodyscyplina
        + α2 * Wynik_Matury
        + α3 * Poziom_Dochodów
        + ε`}
        </pre>

        <p>
          Te modele pozwalają nam sprawdzić, czy sama samodyscyplina
          jest wystarczająca do wyjaśnienia sukcesu, czy też czynniki
          społeczno-ekonomiczne i historia akademicka odgrywają silniejszą rolę.
        </p>

        <button className="btn-ghost small" onClick={() => navigate('/')}>
          ← Powrót do strony głównej
        </button>
      </div>
    </div>
  )
}

export default IncomeFactorsInfo
