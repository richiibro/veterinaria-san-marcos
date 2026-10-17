// src/pages/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { getUsers, addUser } from '../data/dataStore';

const AdminUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', pass: '123456', rol: 'Dueño de mascota' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email) return;

    addUser(form);
    setUsers(getUsers());
    setMsg('Usuario registrado exitosamente.');
    setForm({ nombre: '', email: '', pass: '123456', rol: 'Dueño de mascota' });
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <h2 className="text-success mb-3">Panel de Administración de Usuarios</h2>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-3">
            <h5 className="card-title text-success mb-3">Crear Nuevo Usuario</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={form.nombre}
                  onChange={e => setForm({...form, nombre: e.target.value})}
                  required 
                />
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required 
                />
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold">Rol</label>
                <select 
                  className="form-select" 
                  value={form.rol}
                  onChange={e => setForm({...form, rol: e.target.value})}
                >
                  <option value="Dueño de mascota">Dueño de mascota</option>
                  <option value="Recepcionista">Recepcionista</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success w-100 mt-2 fw-bold">Registrar Usuario</button>
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
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><code>#{u.id}</code></td>
                    <td className="fw-bold">{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.rol === 'Administrador' ? 'bg-danger' : u.rol === 'Recepcionista' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                        {u.rol}
                      </span>
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