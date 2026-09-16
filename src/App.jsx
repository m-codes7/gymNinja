import { Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App