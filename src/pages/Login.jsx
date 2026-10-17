// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../data/dataStore';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = getUsers();
    const found = users.find(u => u.email === email && u.pass === pass);

    if (found) {
      onLogin(found);
      if (found.rol === 'Administrador') {
        navigate('/admin');
      } else {
        navigate('/mis-citas');
      }
    } else {
      setError('Credenciales incorrectas. Revisa el correo o la contraseña.');
    }
  };

  // Botón para autocompletar credenciales en demostraciones
  const fillCredentials = (accEmail, accPass) => {
    setEmail(accEmail);
    setPass(accPass);
    setError('');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm p-4">
          <h3 className="card-title text-center text-success mb-3">Iniciar Sesión</h3>
          
          {error && <div className="alert alert-danger p-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ejemplo@sanmarcos.cl"
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="******"
                required 
              />
            </div>
            <button type="submit" className="btn btn-success w-100 fw-bold">Ingresar</button>
          </form>

          <hr />
          
          {/* Accesos Rápidos para Evaluación */}
          <div className="bg-light p-3 rounded">
            <p className="small text-muted mb-2 fw-bold">Usuarios de prueba (haz clic para autocompletar):</p>
            <div className="d-grid gap-2">
              <button className="btn btn-outline-primary btn-sm text-start" onClick={() => fillCredentials('admin@sanmarcos.cl', '123456')}>
                👑 Admin: <code>admin@sanmarcos.cl</code>
              </button>
              <button className="btn btn-outline-info btn-sm text-start text-dark" onClick={() => fillCredentials('recepcion@sanmarcos.cl', '123456')}>
                📋 Recepción: <code>recepcion@sanmarcos.cl</code>
              </button>
              <button className="btn btn-outline-secondary btn-sm text-start" onClick={() => fillCredentials('juan@gmail.com', '123456')}>
                🐶 Dueño Mascota: <code>juan@gmail.com</code>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;