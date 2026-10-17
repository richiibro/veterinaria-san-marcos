// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import MisCitas from './pages/MisCitas';
import AdminUsuarios from './pages/AdminUsuarios';
import FichaClinica from './pages/FichaClinica';
import MisMascotas from './pages/MisMascotas';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          
          <Route 
            path="/mis-mascotas" 
            element={user ? <MisMascotas user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/mis-citas" 
            element={user ? <MisCitas user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/fichas" 
            element={user ? <FichaClinica user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user && user.rol === 'Administrador' ? <AdminUsuarios /> : <Navigate to="/" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;