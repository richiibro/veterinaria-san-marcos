// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper para obtener el token guardado
export const getToken = () => localStorage.getItem('sanmarcos_token');

// Helper para limpiar sesión cuando el token es inválido o ha expirado
export const clearStoredSession = () => {
  localStorage.removeItem('sanmarcos_token');
  localStorage.removeItem('currentUser');
};

const buildHeaders = (requiresAuth = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleApiError = async (response, fallbackMessage) => {
  let backendMessage = '';
  try {
    const errorData = await response.json();
    backendMessage = errorData.error || errorData.message || '';
  } catch {
    backendMessage = '';
  }

  if (response.status === 401) {
    clearStoredSession();
    window.dispatchEvent(
      new CustomEvent('auth:session-expired', {
        detail: { message: backendMessage || 'Tu sesión expiró o no es válida. Inicia sesión nuevamente.' }
      })
    );
    throw new Error(backendMessage || 'Sesión expirada o inválida. Inicia sesión nuevamente.');
  }

  if (response.status === 403) {
    throw new Error(backendMessage || 'Acceso denegado: tu rol no tiene permisos para realizar esta acción.');
  }

  throw new Error(backendMessage || fallbackMessage);
};

// Iniciar sesión contra Spring Boot (POST /api/auth/login)
export const loginApi = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: buildHeaders(false),
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 400 || response.status === 403) {
      throw new Error('Credenciales incorrectas.');
    }
    throw new Error('No se pudo conectar con el servidor de autenticación.');
  }

  const data = await response.json();
  if (data.token) {
    localStorage.setItem('sanmarcos_token', data.token);
  }
  return data;
};

// Obtener productos desde MySQL (GET /api/productos)
export const getProductosApi = async () => {
  const response = await fetch(`${API_URL}/productos`, {
    method: 'GET',
    headers: buildHeaders(false)
  });

  if (!response.ok) {
    await handleApiError(response, 'Error al cargar productos desde el backend');
  }

  return response.json();
};

// Crear producto en MySQL usando el token JWT (POST /api/productos)
export const crearProductoApi = async (producto) => {
  const response = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(producto)
  });

  if (!response.ok) {
    await handleApiError(response, 'No se pudo crear el producto.');
  }

  return response.json();
};

// Actualizar producto existente en MySQL usando el token JWT (PUT /api/productos/{id})
export const actualizarProductoApi = async (id, producto) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: buildHeaders(true),
    body: JSON.stringify(producto)
  });

  if (!response.ok) {
    await handleApiError(response, 'No se pudo actualizar el producto.');
  }

  return response.json();
};

// Eliminar producto en MySQL usando el token JWT (DELETE /api/productos/{id})
export const eliminarProductoApi = async (id) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(true)
  });

  if (!response.ok) {
    await handleApiError(response, 'No se pudo eliminar el producto.');
  }

  return true;
};