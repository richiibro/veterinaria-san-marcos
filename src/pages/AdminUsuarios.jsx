// src/pages/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { getUsers, addUser } from '../data/dataStore';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('Dueño de mascota');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const data = getUsers();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch {
      setUsuarios([]);
    }
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!nombre.trim() || !email.trim()) {
      setError('Debes completar el nombre y el correo electrónico.');
      return;
    }

    try {
      const creado = addUser({
        nombre: nombre.trim(),
        email: email.trim(),
        rol
      });

      setUsuarios(prev => {
        const base = Array.isArray(prev) ? prev : [];
        if (creado && typeof creado === 'object' && creado.id) {
          const yaExiste = base.some(u => u.id === creado.id);
          return yaExiste ? base : [...base, creado];
        }
        const refrescados = getUsers();
        return Array.isArray(refrescados) ? refrescados : base;
      });

      setNombre('');
      setEmail('');
      setMensaje('Usuario registrado correctamente.');
    } catch {
      setError('No se pudo registrar el usuario.');
    }
  };

  const handleDelete = (usuario) => {
    setMensaje('');
    setError('');

    if (usuario.id === 1 || usuario.email === 'admin@sanmarcos.cl') {
      setError('No se puede eliminar al Administrador General principal.');
      return;
    }

    const confirmed = window.confirm(`¿Seguro que deseas eliminar a "${usuario.nombre}"?`);
    if (!confirmed) return;

    setUsuarios(prev => {
      const base = Array.isArray(prev) ? prev : [];
      const actualizada = base.filter(u => u.id !== usuario.id);
      localStorage.setItem('sanmarcos_usuarios', JSON.stringify(actualizada));
      return actualizada;
    });

    setMensaje(`Usuario "${usuario.nombre}" eliminado de la lista.`);
  };

  const getBadgeClass = (rolUsuario) => {
    if (rolUsuario === 'Administrador') return 'bg-danger';
    if (rolUsuario === 'Recepcionista') return 'bg-warning text-dark';
    return 'bg-primary';
  };

  const listaUsuarios = Array.isArray(usuarios) ? usuarios : [];

  return (
    <div>
      <h2 className="text-success mb-4">Panel de Administración de Usuarios</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h5 className="text-success mb-3">Crear Nuevo Usuario</h5>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej. Camila Soto"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="camila@sanmarcos.cl"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Rol</label>
                <select
                  className="form-select"
                  value={rol}
                  onChange={e => setRol(e.target.value)}
                >
                  <option value="Dueño de mascota">Dueño de mascota</option>
                  <option value="Recepcionista">Recepcionista</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold">
                Registrar Usuario
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="table-responsive">
            <table className="table table-hover align-middle shadow-sm bg-white rounded">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaUsuarios.map((u, index) => (
                  <tr key={u.id ?? index}>
                    <td><code className="text-danger">#{u.id ?? index + 1}</code></td>
                    <td className="fw-bold">{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(u.rol)}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="text-end">
                      {u.id !== 1 && u.email !== 'admin@sanmarcos.cl' ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(u)}
                        >
                          Eliminar
                        </button>
                      ) : (
                        <span className="text-muted small">Protegido</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;