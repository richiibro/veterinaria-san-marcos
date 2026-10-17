// src/pages/Home.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Home = () => {
  // Coordenadas geográficas de Rancagua
  const position = [-34.1701, -70.7407];

  return (
    <div>
      {/* Banner Principal */}
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm text-center">
        <h1 className="display-5 fw-bold text-success">Veterinaria San Marcos</h1>
        <p className="lead fs-4">
          Atención profesional para perros, gatos, conejos y aves en Rancagua desde 2009.
        </p>
      </div>

      {/* Servicios Destacados */}
      <div className="row text-center mb-4">
        <div className="col-md-4 mb-3">
          <div className="card h-100 p-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Consultas Generales</h5>
              <p className="card-text">Examen clínico preventivo y diagnóstico con médicos veterinarios capacitados.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100 p-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Vacunación y Control</h5>
              <p className="card-text">Planes de vacunación al día y recordatorios automáticos de inmunización.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100 p-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Cirugía Menor</h5>
              <p className="card-text">Procedimientos quirúrgicos seguros y control de peso para tus mascotas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa Interactivo de la Clínica (Requisito Obligatorio) */}
      <div className="card p-3 shadow-sm mb-5">
        <h4 className="text-success mb-3">Ubicación de nuestra Clínica</h4>
        <p className="text-muted">Encuéntranos en la ciudad de Rancagua, Región del Libertador General Bernardo O'Higgins.</p>
        <div style={{ height: '350px', width: '100%' }}>
          <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={position}>
              <Popup>
                <strong>Veterinaria San Marcos</strong><br />
                Atención médica veterinaria en Rancagua.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;