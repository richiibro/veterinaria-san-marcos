// src/services/api.js
const API_URL = 'http://localhost:8080/api';

// Helper para obtener el token guardado
export const getToken = () => localStorage.getItem('sanmarcos_token');

// Iniciar sesión contra Spring Boot (POST /api/auth/login)
export const loginApi = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Credenciales incorrectas o servidor no disponible.');
  }

  const data = await response.json();
  // Guardamos el token JWT para futuras peticiones protegidas
  localStorage.setItem('sanmarcos_token', data.token);
  return data;
};

// Obtener productos desde MySQL (GET /api/productos)
export const getProductosApi = async () => {
  const response = await fetch(`${API_URL}/productos`);
  if (!response.ok) {
    throw new Error('Error al cargar productos desde el backend');
  }
  return response.json();
};

// Crear producto en MySQL usando el token JWT (POST /api/productos)
export const crearProductoApi = async (producto) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(producto)
  });

  if (!response.ok) {
    throw new Error('No autorizado o error al crear el producto');
  }
  return response.json();
};