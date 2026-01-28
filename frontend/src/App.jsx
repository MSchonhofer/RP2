// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Questionnaire from './pages/Questionnaire.jsx'
import ResearchInfo from './pages/ResearchInfo.jsx'
import SelfDisciplineInfo from './pages/SelfDisciplineInfo.jsx'
import StemPredictionInfo from './pages/StemPredictionInfo.jsx'
import IncomePerformanceInfo from './pages/IncomePerformanceInfo.jsx'
import DepartmentFitInfo from "./pages/DepartmentFitInfo";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/research-info" element={<ResearchInfo />} />
      <Route path="/self-discipline" element={<SelfDisciplineInfo />} />
      <Route path="/stem-prediction" element={<StemPredictionInfo />} />
      <Route path="/income-performance" element={<IncomePerformanceInfo />} />
      <Route path="/department-fit" element={<DepartmentFitInfo />} />
    </Routes>
  )
}

export default App
