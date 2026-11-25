// src/pages/MisCitas.jsx
import React, { useState, useEffect } from 'react';
import { getCitas, addCita, updateEstadoCita } from '../data/dataStore';

const MisCitas = ({ user }) => {
  const [citas, setCitas] = useState([]);
  const [form, setForm] = useState({ mascota: '', especie: 'Perro', servicio: 'Consulta general', fecha: '', hora: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadCitas();
  }, []);

  const loadCitas = () => {
    const data = getCitas();
    if (user.rol === 'Dueño de mascota') {
      setCitas(data.filter(c => c.duenoId === user.id));
    } else {
      setCitas(data);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.mascota || !form.fecha || !form.hora) return;

    addCita({
      ...form,
      duenoId: user.id,
      duenoNombre: user.nombre
    });

    setMsg('¡Solicitud de cita enviada con éxito!');
    setForm({ mascota: '', especie: 'Perro', servicio: 'Consulta general', fecha: '', hora: '' });
    loadCitas();
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEstado = (id, nuevoEstado) => {
    updateEstadoCita(id, nuevoEstado);
    loadCitas();
  };

  return (
    <div>
      <h2 className="text-success mb-3">Gestión de Citas Médicas</h2>

      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Formulario solo para Dueños de Mascota */}
      {user.rol === 'Dueño de mascota' && (
        <div className="card shadow-sm p-4 mb-4">
          <h5 className="card-title text-success mb-3">Solicitar Nueva Cita</h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-bold">Mascota</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nombre mascota" 
                value={form.mascota}
                onChange={e => setForm({...form, mascota: e.target.value})}
                required 
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Especie</label>
              <select className="form-select" value={form.especie} onChange={e => setForm({...form, especie: e.target.value})}>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Conejo">Conejo</option>
                <option value="Ave">Ave</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Servicio</label>
              <select className="form-select" value={form.servicio} onChange={e => setForm({...form, servicio: e.target.value})}>
                <option value="Consulta general">Consulta general</option>
                <option value="Vacuna Antirrábica">Vacuna Antirrábica</option>
                <option value="Cirugía menor">Cirugía menor</option>
                <option value="Desparasitación">Desparasitación</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Fecha</label>
              <input 
                type="date" 
                className="form-control" 
                value={form.fecha}
                onChange={e => setForm({...form, fecha: e.target.value})}
                required 
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Hora</label>
              <input 
                type="time" 
                className="form-control" 
                value={form.hora}
                onChange={e => setForm({...form, hora: e.target.value})}
                required 
              />
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-success fw-bold">Enviar Solicitud</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Citas */}
      <div className="table-responsive">
        <table className="table table-striped align-middle shadow-sm bg-white rounded">
          <thead className="table-dark">
            <tr>
              <th>Mascota</th>
              <th>Dueño</th>
              <th>Servicio</th>
              <th>Fecha y Hora</th>
              <th>Estado</th>
              {(user.rol === 'Recepcionista' || user.rol === 'Administrador') && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-3">No hay citas registradas.</td></tr>
            ) : (
              citas.map(c => (
                <tr key={c.id}>
                  <td className="fw-bold">{c.mascota} <small className="text-muted">({c.especie})</small></td>
                  <td>{c.duenoNombre}</td>
                  <td>{c.servicio}</td>
                  <td>{c.fecha} - {c.hora} hrs</td>
                  <td>
                    <span className={`badge ${c.estado === 'Confirmada' ? 'bg-success' : c.estado === 'Pendiente' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                      {c.estado}
                    </span>
                  </td>
                  {(user.rol === 'Recepcionista' || user.rol === 'Administrador') && (
                    <td>
                      <button className="btn btn-sm btn-success me-1" onClick={() => handleEstado(c.id, 'Confirmada')}>Confirmar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEstado(c.id, 'Cancelada')}>Cancelar</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MisCitas;