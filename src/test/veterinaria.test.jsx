// src/test/veterinaria.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

import Navbar from '../components/Navbar';
import Catalogo from '../pages/Catalogo';
import Login from '../pages/Login';
import { getServicios, getCitas, updateEstadoCita, addUser, getUsers } from '../data/dataStore';

describe('Suite de 10 Pruebas Unitarias - Veterinaria San Marcos', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // Test 1: Renderizado de Componente
  it('1. Debe renderizar el nombre de la clínica en la barra de navegación', () => {
    render(
      <MemoryRouter>
        <Navbar user={null} onLogout={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Vet. San Marcos/i)).toBeInTheDocument();
  });

  // Test 2: Props y Estado Visual
  it('2. Debe mostrar el botón de Iniciar Sesión si el usuario no está autenticado', () => {
    render(
      <MemoryRouter>
        <Navbar user={null} onLogout={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  // Test 3: Props con Usuario Logueado
  it('3. Debe mostrar el nombre del usuario y su rol cuando hay sesión activa', () => {
    const fakeUser = { nombre: 'María Recepción', rol: 'Recepcionista' };
    render(
      <MemoryRouter>
        <Navbar user={fakeUser} onLogout={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/María Recepción/i)).toBeInTheDocument();
  });

  // Test 4: Función de Datos / LocalStorage
  it('4. Debe retornar los servicios iniciales del catálogo desde dataStore', () => {
    const servicios = getServicios();
    expect(servicios.length).toBeGreaterThan(0);
    expect(servicios[0].nombre).toBe('Consulta general');
  });

  // Test 5: Simulación de Eventos de Formulario
  it('5. Debe permitir escribir en el campo de correo en la vista de Login', () => {
    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    );
    const inputEmail = screen.getByPlaceholderText('ejemplo@sanmarcos.cl');
    fireEvent.change(inputEmail, { target: { value: 'admin@sanmarcos.cl' } });
    expect(inputEmail.value).toBe('admin@sanmarcos.cl');
  });

  // Test 6: Renderizado Condicional de Alerta (Corregido)
  it('6. Debe mostrar mensaje de error en Login con credenciales inválidas', () => {
    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    );

    // 1. Llenamos los campos con credenciales falsas para superar la validación HTML
    const inputEmail = screen.getByPlaceholderText('ejemplo@sanmarcos.cl');
    const inputPass = screen.getByPlaceholderText('******');
    
    fireEvent.change(inputEmail, { target: { value: 'falso@sanmarcos.cl' } });
    fireEvent.change(inputPass, { target: { value: 'claveincorrecta' } });

    // 2. Hacemos clic en el botón de ingreso
    const btnSubmit = screen.getByRole('button', { name: /Ingresar/i });
    fireEvent.click(btnSubmit);

    // 3. Verificamos que aparezca la alerta de error
    expect(screen.getByText(/Credenciales incorrectas/i)).toBeInTheDocument();
  });

  // Test 7: Mock de Funciones (Spy)
  it('7. Debe ejecutar la función de Logout al hacer clic en Cerrar Sesión', () => {
    const mockLogout = vi.fn();
    const fakeUser = { nombre: 'Admin', rol: 'Administrador' };
    render(
      <MemoryRouter>
        <Navbar user={fakeUser} onLogout={mockLogout} />
      </MemoryRouter>
    );
    const btnLogout = screen.getByText('Cerrar Sesión');
    fireEvent.click(btnLogout);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  // Test 8: Modificación de Estado CRUD
  it('8. Debe actualizar el estado de una cita a Confirmada', () => {
    const citasIniciales = getCitas();
    const citaId = citasIniciales[0].id;
    
    updateEstadoCita(citaId, 'Confirmada');
    
    const citasActualizadas = getCitas();
    const citaModificada = citasActualizadas.find(c => c.id === citaId);
    expect(citaModificada.estado).toBe('Confirmada');
  });

  // Test 9: Agregar nuevo registro (CRUD)
  it('9. Debe agregar un nuevo usuario al dataStore correctamente', () => {
    const nuevoUser = { nombre: 'Doctor Vete', email: 'doc@sanmarcos.cl', pass: '123456', rol: 'Recepcionista' };
    addUser(nuevoUser);

    const usuarios = getUsers();
    const encontrado = usuarios.find(u => u.email === 'doc@sanmarcos.cl');
    expect(encontrado).toBeDefined();
    expect(encontrado.nombre).toBe('Doctor Vete');
  });

  // Test 10: Filtro interactivo en Catálogo
  it('10. Debe filtrar la lista de servicios en el Catálogo según el texto ingresado', () => {
    render(<Catalogo />);
    const searchInput = screen.getByPlaceholderText(/Buscar por nombre o categoría/i);
    fireEvent.change(searchInput, { target: { value: 'Cirugía' } });

    expect(screen.getByText('Cirugía menor')).toBeInTheDocument();
    expect(screen.queryByText('Consulta general')).not.toBeInTheDocument();
  });

});