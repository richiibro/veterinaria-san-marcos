// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-3 mt-5">
      <div className="container text-center text-md-start">
        <div className="row">
          <div className="col-md-6 mb-3">
            <h5 className="text-success fw-bold">Veterinaria San Marcos</h5>
            <p className="small text-light mb-0">
              Atención médica profesional para perros, gatos, conejos y aves en Rancagua desde 2009.
            </p>
          </div>
          <div className="col-md-6 mb-3 text-md-end">
            <h6 className="fw-bold text-white">Contacto y Horario</h6>
            <p className="small text-light mb-1">📍 Rancagua, Región del O'Higgins</p>
            <p className="small text-light mb-0">⏰ Lunes a Sábado: 09:00 - 19:00 hrs</p>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center small text-light">
          © {new Date().getFullYear()} Veterinaria San Marcos — Proyecto DSY1104
        </div>
      </div>
    </footer>
  );
};

export default Footer;