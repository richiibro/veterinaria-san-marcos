// src/pages/Catalogo.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getServicios } from '../data/dataStore';
import {
  getProductosApi,
  crearProductoApi,
  actualizarProductoApi,
  eliminarProductoApi
} from '../services/api';

const INITIAL_FORM = {
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  stock: '',
  imagenUrl: ''
};

const Catalogo = ({ user }) => {
  const isAdmin = user?.rol === 'Administrador';

  const [servicios, setServicios] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('servicios');
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [errorBackend, setErrorBackend] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Estado para crear o editar producto (solo Administrador)
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const cargarProductos = useCallback(async () => {
    setLoadingProductos(true);
    setErrorBackend('');
    try {
      const data = await getProductosApi();
      setMedicamentos(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorBackend(err.message || 'No se pudo conectar con el servidor de productos (puerto 8080).');
    } finally {
      setLoadingProductos(false);
    }
  }, []);

  useEffect(() => {
    setServicios(getServicios());
    cargarProductos();
  }, [cargarProductos]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
  };

  const handleEditClick = (producto) => {
    setEditingId(producto.id);
    setForm({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      categoria: producto.categoria || '',
      precio: producto.precio ?? '',
      stock: producto.stock ?? '',
      imagenUrl: producto.imagenUrl || ''
    });
    setFeedback({ type: '', text: '' });
  };

  const handleSaveProducto = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      categoria: form.categoria.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagenUrl: form.imagenUrl.trim() || null
    };

    try {
      if (editingId !== null) {
        await actualizarProductoApi(editingId, payload);
        setFeedback({ type: 'success', text: 'Producto actualizado correctamente en MySQL.' });
      } else {
        await crearProductoApi(payload);
        setFeedback({ type: 'success', text: 'Producto creado correctamente en MySQL.' });
      }
      resetForm();
      await cargarProductos();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message || 'Error al guardar el producto.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProducto = async (producto) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(`¿Eliminar el producto "${producto.nombre}"?`);
    if (!confirmed) return;

    setFeedback({ type: '', text: '' });
    try {
      await eliminarProductoApi(producto.id);
      if (editingId === producto.id) {
        resetForm();
      }
      setFeedback({ type: 'success', text: `Producto "${producto.nombre}" eliminado.` });
      await cargarProductos();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message || 'No se pudo eliminar el producto.' });
    }
  };

  const filteredServicios = servicios.filter(s =>
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    s.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMedicamentos = medicamentos.filter(m =>
    (m.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.categoria || '').toLowerCase().includes(search.toLowerCase())
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
            Medicamentos y Vacunas (MySQL)
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

      {/* Vista de Medicamentos / Stock desde MySQL */}
      {tab === 'medicamentos' && (
        <div>
          {feedback.text && (
            <div className={`alert alert-${feedback.type} alert-dismissible`} role="alert">
              {feedback.text}
            </div>
          )}

          {errorBackend && (
            <div className="alert alert-warning d-flex justify-content-between align-items-center">
              <span>{errorBackend}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-dark ms-3"
                onClick={cargarProductos}
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Formulario CRUD visible únicamente para Administrador */}
          {isAdmin && (
            <div className="card shadow-sm mb-4 border-success">
              <div className="card-header bg-success text-white fw-bold">
                {editingId !== null ? `Editar producto #${editingId}` : 'Agregar nuevo producto al inventario'}
              </div>
              <div className="card-body">
                <form onSubmit={handleSaveProducto} className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Nombre comercial *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={form.nombre}
                      onChange={handleFormChange}
                      placeholder="Ej. Vacuna Antirrábica"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Categoría *</label>
                    <input
                      type="text"
                      name="categoria"
                      className="form-control"
                      value={form.categoria}
                      onChange={handleFormChange}
                      placeholder="Ej. Vacunas / Antiparasitarios"
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold">Precio (CLP) *</label>
                    <input
                      type="number"
                      name="precio"
                      min="1"
                      step="1"
                      className="form-control"
                      value={form.precio}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      step="1"
                      className="form-control"
                      value={form.stock}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-bold">Descripción</label>
                    <input
                      type="text"
                      name="descripcion"
                      className="form-control"
                      value={form.descripcion}
                      onChange={handleFormChange}
                      placeholder="Detalle breve del medicamento o vacuna"
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end gap-2">
                    <button
                      type="submit"
                      className="btn btn-success fw-bold flex-grow-1"
                      disabled={submitting}
                    >
                      {submitting
                        ? 'Guardando...'
                        : editingId !== null
                          ? 'Guardar cambios'
                          : 'Crear producto'}
                    </button>
                    {editingId !== null && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={resetForm}
                        disabled={submitting}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {loadingProductos ? (
            <div className="alert alert-secondary">Cargando inventario desde MySQL...</div>
          ) : !errorBackend && filteredMedicamentos.length === 0 ? (
            <div className="alert alert-info">
              Conectado a MySQL correctamente, pero aún no hay productos registrados en la tabla <code>productos</code>.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle shadow-sm bg-white rounded">
                <thead className="table-success">
                  <tr>
                    <th>ID</th>
                    <th>Nombre comercial</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    {isAdmin && <th className="text-end">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicamentos.map(m => (
                    <tr key={m.id}>
                      <td><code>#{m.id}</code></td>
                      <td className="fw-bold">{m.nombre}</td>
                      <td>{m.descripcion || 'Sin descripción'}</td>
                      <td><span className="badge bg-info text-dark">{m.categoria}</span></td>
                      <td>
                        <span className={`badge ${m.stock < 20 ? 'bg-danger' : 'bg-success'}`}>
                          {m.stock} unidades
                        </span>
                      </td>
                      <td className="fw-bold">${Number(m.precio).toLocaleString('es-CL')} CLP</td>
                      {isAdmin && (
                        <td className="text-end text-nowrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditClick(m)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProducto(m)}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catalogo;