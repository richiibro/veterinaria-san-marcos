// src/pages/MisMascotas.jsx
import React, { useState, useEffect } from 'react';
import { getMascotas, addMascota, getFichas } from '../data/dataStore';

const MisMascotas = ({ user }) => {
  const [mascotas, setMascotas] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [form, setForm] = useState({ nombre: '', especie: 'Perro', raza: '', edad: '', peso: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allMascotas = getMascotas();
    const misMascotas = user.rol === 'Dueño de mascota' 
      ? allMascotas.filter(m => m.duenoId === user.id)
      : allMascotas;
    setMascotas(misMascotas);
    setFichas(getFichas());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre) return;

    addMascota({
      ...form,
      duenoId: user.id
    });

    loadData();
    setMsg('¡Mascota registrada exitosamente!');
    setForm({ nombre: '', especie: 'Perro', raza: '', edad: '', peso: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <h2 className="text-success mb-3">Mis Mascotas Registradas</h2>

      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Formulario para agregar mascota */}
      <div className="card shadow-sm p-4 mb-4">
        <h5 className="card-title text-success mb-3">Registrar Nueva Mascota</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-bold">Nombre</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej. Pelusa"
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
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
            <label className="form-label fw-bold">Raza</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej. Poodle, Mestizo"
              value={form.raza}
              onChange={e => setForm({...form, raza: e.target.value})}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label fw-bold">Edad</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej. 2 años"
              value={form.edad}
              onChange={e => setForm({...form, edad: e.target.value})}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label fw-bold">Peso</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej. 5 kg"
              value={form.peso}
              onChange={e => setForm({...form, peso: e.target.value})}
            />
          </div>
          <div className="col-12 text-end">
            <button type="submit" className="btn btn-success fw-bold">Guardar Mascota</button>
          </div>
        </form>
      </div>

      {/* Listado de Mascotas */}
      <div className="row">
        {mascotas.map(m => {
          const historialMascota = fichas.filter(f => f.mascotaId === m.id);
          return (
            <div key={m.id} className="col-md-6 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-success text-white fw-bold">
                  🐾 {m.nombre} ({m.especie})
                </div>
                <div className="card-body">
                  <p className="mb-1"><strong>Raza:</strong> {m.raza || 'No registrada'}</p>
                  <p className="mb-1"><strong>Edad:</strong> {m.edad || 'N/A'} | <strong>Peso:</strong> {m.peso || 'N/A'}</p>
                  <hr />
                  <h6 className="fw-bold text-success">Historial Clínico:</h6>
                  {historialMascota.length === 0 ? (
                    <small className="text-muted">Sin atenciones registradas aún.</small>
                  ) : (
                    historialMascota.map(h => (
                      <div key={h.id} className="p-2 bg-light rounded mb-2">
                        <small className="d-block text-muted">{h.fecha} - {h.veterinario}</small>
                        <small className="d-block"><strong>Diag:</strong> {h.diagnostico}</small>
                        {h.vacunaVencimiento && (
                          <small className="d-block text-danger fw-bold">Próx. Vacuna: {h.vacunaVencimiento}</small>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MisMascotas;