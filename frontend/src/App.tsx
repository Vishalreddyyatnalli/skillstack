
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import AddSkill from './pages/AddSkill'
import SkillsList from './pages/SkillsList'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-skill" element={<AddSkill />} />
          <Route path="/skills" element={<SkillsList />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App;
