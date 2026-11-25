// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import MisCitas from './pages/MisCitas';
import AdminUsuarios from './pages/AdminUsuarios';
import FichaClinica from './pages/FichaClinica';
import MisMascotas from './pages/MisMascotas';
import Reportes from './pages/Reportes';
import { clearStoredSession } from './services/api';

const AppContent = ({ user, onLogin, onLogout, sessionNotice, onClearSessionNotice }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = (event) => {
      const msg = event?.detail?.message || 'Tu sesión expiró o no es válida. Inicia sesión nuevamente.';
      onLogout(msg);
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [onLogout, navigate]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} onLogout={() => onLogout('')} />
      <div className="container my-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo user={user} />} />
          <Route
            path="/login"
            element={
              <Login
                onLogin={(userData) => {
                  onClearSessionNotice();
                  onLogin(userData);
                }}
                sessionNotice={sessionNotice}
              />
            }
          />

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
          <Route
            path="/reportes"
            element={user && user.rol === 'Administrador' ? <Reportes /> : <Navigate to="/" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('currentUser');
      return null;
    }
  });

  const [sessionNotice, setSessionNotice] = useState('');

  const handleLogin = (userData) => {
    setUser(userData);
    setSessionNotice('');
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = (noticeMessage = '') => {
    setUser(null);
    clearStoredSession();
    if (noticeMessage) {
      setSessionNotice(noticeMessage);
    }
  };

  const handleClearSessionNotice = () => {
    setSessionNotice('');
  };

  return (
    <Router>
      <AppContent
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        sessionNotice={sessionNotice}
        onClearSessionNotice={handleClearSessionNotice}
      />
    </Router>
  );
}

export default App;