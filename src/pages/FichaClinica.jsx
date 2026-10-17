// src/pages/FichaClinica.jsx
import React, { useState, useEffect } from 'react';
import { getFichas, addFicha, getMascotas } from '../data/dataStore';

const FichaClinica = ({ user }) => {
  const [fichas, setFichas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    mascotaId: '',
    fecha: new Date().toISOString().split('T')[0],
    diagnostico: '',
    medicamentos: '',
    vacunaAplicada: 'Ninguna',
    vacunaVencimiento: '',
    proximoControl: '',
    veterinario: user?.nombre || 'Dr. Médico Veterinario'
  });

  useEffect(() => {
    setFichas(getFichas());
    setMascotas(getMascotas());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.mascotaId || !form.diagnostico) return;

    const mascotaSel = mascotas.find(m => m.id === parseInt(form.mascotaId));
    
    addFicha({
      ...form,
      mascotaId: parseInt(form.mascotaId),
      mascotaNombre: mascotaSel ? mascotaSel.nombre : 'Paciente',
      duenoNombre: 'Cliente San Marcos'
    });

    setFichas(getFichas());
    setMsg('Ficha clínica guardada digitalmente.');
    setForm({
      mascotaId: '',
      fecha: new Date().toISOString().split('T')[0],
      diagnostico: '',
      medicamentos: '',
      vacunaAplicada: 'Ninguna',
      vacunaVencimiento: '',
      proximoControl: '',
      veterinario: user?.nombre || 'Dr. Médico Veterinario'
    });
    setTimeout(() => setMsg(''), 3000);
  };

  const filteredFichas = fichas.filter(f => 
    f.mascotaNombre.toLowerCase().includes(search.toLowerCase()) ||
    f.diagnostico.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-success mb-3">Fichas Clínicas Digitales</h2>
      
      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Formulario solo para Recepcionista / Administrador */}
      {(user?.rol === 'Recepcionista' || user?.rol === 'Administrador') && (
        <div className="card shadow-sm p-4 mb-4">
          <h5 className="card-title text-success mb-3">Registrar Nueva Consulta Médica</h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Mascota (Paciente)</label>
              <select 
                className="form-select" 
                value={form.mascotaId} 
                onChange={e => setForm({...form, mascotaId: e.target.value})}
                required
              >
                <option value="">-- Seleccionar Paciente --</option>
                {mascotas.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Fecha Atención</label>
              <input 
                type="date" 
                className="form-control" 
                value={form.fecha} 
                onChange={e => setForm({...form, fecha: e.target.value})} 
                required 
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Médico Veterinario</label>
              <input 
                type="text" 
                className="form-control" 
                value={form.veterinario} 
                onChange={e => setForm({...form, veterinario: e.target.value})} 
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Diagnóstico Clínico</label>
              <textarea 
                className="form-control" 
                rows="2" 
                placeholder="Escribe el examen o diagnóstico..."
                value={form.diagnostico}
                onChange={e => setForm({...form, diagnostico: e.target.value})}
                required
              ></textarea>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Medicamentos y Tratamiento Recetado</label>
              <textarea 
                className="form-control" 
                rows="2" 
                placeholder="Indica dosis y frecuencia..."
                value={form.medicamentos}
                onChange={e => setForm({...form, medicamentos: e.target.value})}
              ></textarea>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Vacuna Aplicada</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej. Antirrábica, Octuple" 
                value={form.vacunaAplicada}
                onChange={e => setForm({...form, vacunaAplicada: e.target.value})}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Vencimiento / Próxima Vacuna</label>
              <input 
                type="date" 
                className="form-control" 
                value={form.vacunaVencimiento}
                onChange={e => setForm({...form, vacunaVencimiento: e.target.value})}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Próximo Control</label>
              <input 
                type="date" 
                className="form-control" 
                value={form.proximoControl}
                onChange={e => setForm({...form, proximoControl: e.target.value})}
              />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-success fw-bold">Guardar Ficha Digital</button>
            </div>
          </form>
        </div>
      )}

      {/* Buscador de Fichas */}
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="🔍 Buscar en el historial por nombre de mascota o diagnóstico..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Historial Clínico Digital */}
      <div className="row">
        {filteredFichas.map(f => (
          <div key={f.id} className="col-12 mb-3">
            <div className="card shadow-sm border-0 border-start border-success border-5">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title text-success mb-0">🐾 Paciente: {f.mascotaNombre}</h5>
                  <span className="badge bg-secondary">Fecha: {f.fecha}</span>
                </div>
                <p className="mb-1"><strong>Atendido por:</strong> {f.veterinario}</p>
                <p className="mb-1"><strong>Diagnóstico:</strong> {f.diagnostico}</p>
                {f.medicamentos && <p className="mb-1 text-primary"><strong>Receta / Tratamiento:</strong> {f.medicamentos}</p>}
                
                {f.vacunaAplicada && f.vacunaAplicada !== 'Ninguna' && (
                  <div className="mt-2 p-2 bg-light rounded d-flex justify-content-between align-items-center">
                    <small>💉 <strong>Vacuna:</strong> {f.vacunaAplicada}</small>
                    <small className="text-danger fw-bold">Vence: {f.vacunaVencimiento || 'Sin especificar'}</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FichaClinica;