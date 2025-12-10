// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Questionnaire from './pages/Questionnaire.jsx'
import SelfDisciplineInfo from './pages/SelfDisciplineInfo.jsx'
import StemPredictionInfo from './pages/StemPredictionInfo.jsx'
import IncomeFactorsInfo from './pages/IncomeFactorsInfo.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/self-discipline" element={<SelfDisciplineInfo />} />
      <Route path="/stem-prediction" element={<StemPredictionInfo />} />
      <Route path="/income-performance" element={<IncomeFactorsInfo />} />
    </Routes>
  )
}

export default App
