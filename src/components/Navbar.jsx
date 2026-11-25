// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🐾 Vet. San Marcos
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">Catálogo y Stock</Link>
            </li>
            
            {/* Vistas disponibles para usuarios autenticados */}
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/mis-mascotas">Mis Mascotas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/mis-citas">Gestión de Citas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/fichas">Fichas Clínicas</Link>
                </li>
              </>
            )}

            {/* Vistas exclusivas para Administrador */}
            {user && user.rol === 'Administrador' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-warning" to="/admin">Panel Admin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-info" to="/reportes">Reportes</Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="text-white me-3 text-end">
                <small className="d-block">Hola, <strong>{user.nombre}</strong> ({user.rol})</small>
                <button className="btn btn-outline-light btn-sm mt-1" onClick={handleLogoutClick}>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link className="btn btn-light text-success fw-bold" to="/login">Iniciar Sesión</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;