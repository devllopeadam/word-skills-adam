import { Route, Routes } from 'react-router-dom'
import './App.css'
import Bienvenue from './pages/Bienvenue'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Bienvenue />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
