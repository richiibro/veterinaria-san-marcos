// src/pages/Reportes.jsx
import React, { useState, useEffect } from 'react';
import { getFichas, getCitas, getMascotas } from '../data/dataStore';

const Reportes = () => {
  const [fichas, setFichas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    setFichas(getFichas());
    setCitas(getCitas());
    setMascotas(getMascotas());
  }, []);

  const totalAtenciones = fichas.length;
  const citasConfirmadas = citas.filter(c => c.estado === 'Confirmada').length;
  const totalPacientes = mascotas.length;

  return (
    <div>
      <h2 className="text-success mb-4">📊 Reportes y Estadísticas de Atención</h2>

      {/* Tarjetas de Indicadores */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white shadow-sm p-3 text-center">
            <h5>Total Pacientes</h5>
            <h2 className="fw-bold">{totalPacientes}</h2>
            <small>Mascotas registradas</small>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card bg-primary text-white shadow-sm p-3 text-center">
            <h5>Atenciones Clínicas</h5>
            <h2 className="fw-bold">{totalAtenciones}</h2>
            <small>Fichas generadas</small>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card bg-info text-white shadow-sm p-3 text-center">
            <h5>Citas Confirmadas</h5>
            <h2 className="fw-bold">{citasConfirmadas}</h2>
            <small>Agenda activa</small>
          </div>
        </div>
      </div>

      {/* Resumen de Atenciones */}
      <div className="card shadow-sm p-4">
        <h5 className="text-success mb-3">Resumen de Consultas Médicas</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Diagnóstico</th>
                <th>Veterinario</th>
              </tr>
            </thead>
            <tbody>
              {fichas.map(f => (
                <tr key={f.id}>
                  <td>{f.fecha}</td>
                  <td className="fw-bold">{f.mascotaNombre}</td>
                  <td>{f.diagnostico}</td>
                  <td>{f.veterinario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;