// src/pages/Catalogo.jsx
import React, { useState, useEffect } from 'react';
import { getServicios, getMedicamentos } from '../data/dataStore';

const Catalogo = () => {
  const [servicios, setServicios] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('servicios');

  useEffect(() => {
    setServicios(getServicios());
    setMedicamentos(getMedicamentos());
  }, []);

  const filteredServicios = servicios.filter(s => 
    s.nombre.toLowerCase().includes(search.toLowerCase()) || 
    s.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMedicamentos = medicamentos.filter(m => 
    m.nombre.toLowerCase().includes(search.toLowerCase()) || 
    m.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-success mb-3">Catálogo y Stock de Veterinaria San Marcos</h2>
      
      {/* Barra de búsqueda y pestañas */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input 
            type="text" 
            className="form-control" 
            placeholder="🔍 Buscar por nombre o categoría..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <button 
            className={`btn me-2 ${tab === 'servicios' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setTab('servicios')}
          >
            Servicios Clínicos
          </button>
          <button 
            className={`btn ${tab === 'medicamentos' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setTab('medicamentos')}
          >
            Medicamentos y Vacunas
          </button>
        </div>
      </div>

      {/* Vista de Servicios */}
      {tab === 'servicios' && (
        <div className="row">
          {filteredServicios.map(s => (
            <div key={s.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100 shadow-sm border-0 border-top border-success border-4">
                <div className="card-body">
                  <span className="badge bg-secondary mb-2">{s.categoria}</span>
                  <h5 className="card-title text-success">{s.nombre}</h5>
                  <p className="card-text mb-1"><strong>Especie:</strong> {s.especie}</p>
                  <p className="card-text mb-1"><strong>Duración:</strong> {s.duracion}</p>
                  <p className="card-text fw-bold text-primary mt-2 fs-5">
                    ${s.precio.toLocaleString('es-CL')} CLP
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Medicamentos / Stock */}
      {tab === 'medicamentos' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm bg-white rounded">
            <thead className="table-success">
              <tr>
                <th>Código</th>
                <th>Nombre comercial</th>
                <th>Principio activo</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicamentos.map(m => (
                <tr key={m.id}>
                  <td><code>{m.id}</code></td>
                  <td className="fw-bold">{m.nombre}</td>
                  <td>{m.activo}</td>
                  <td><span className="badge bg-info text-dark">{m.categoria}</span></td>
                  <td>
                    <span className={`badge ${m.stock < 20 ? 'bg-danger' : 'bg-success'}`}>
                      {m.stock} unidades
                    </span>
                  </td>
                  <td className="fw-bold">${m.precio.toLocaleString('es-CL')} CLP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Catalogo;