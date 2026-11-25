// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginApi(email, pass);

      // Adaptamos el rol del backend al formato que espera tu frontend
      let rolFrontend = 'Dueño de mascota';
      if (data.rol === 'ROLE_ADMIN' || data.email === 'admin@sanmarcos.cl') {
        rolFrontend = 'Administrador';
      } else if (data.rol === 'ROLE_VETERINARIO') {
        rolFrontend = 'Recepcionista';
      }

      const usuarioAutenticado = {
        nombre: data.nombre,
        email: data.email,
        rol: rolFrontend,
        token: data.token
      };

      onLogin(usuarioAutenticado);

      if (rolFrontend === 'Administrador') {
        navigate('/admin');
      } else {
        navigate('/mis-citas');
      }
    } catch (err) {
      setError('Credenciales incorrectas. Verifica que el backend esté encendido.');
    } finally {
      setLoading(false);
    }
  };

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
            <button type="submit" className="btn btn-success w-100 fw-bold" disabled={loading}>
              {loading ? 'Conectando...' : 'Ingresar'}
            </button>
          </form>

          <hr />

          <div className="bg-light p-3 rounded">
            <p className="small text-muted mb-2 fw-bold">Usuario registrado en MySQL (clic para autocompletar):</p>
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm text-start"
                onClick={() => fillCredentials('admin@sanmarcos.cl', '123456')}
              >
                👑 Admin: <code>admin@sanmarcos.cl</code>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;