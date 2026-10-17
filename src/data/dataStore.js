// src/data/dataStore.js

// Servicios del catálogo oficial de Veterinaria San Marcos (Forma A)
const INITIAL_SERVICIOS = [
  { id: 'SV001', categoria: 'Consultas', nombre: 'Consulta general', especie: 'Perro / Gato', duracion: '30 min', precio: 15000 },
  { id: 'SV002', categoria: 'Vacunación', nombre: 'Vacuna Antirrábica', especie: 'Perro / Gato', duracion: '15 min', precio: 12000 },
  { id: 'SV003', categoria: 'Cirugía', nombre: 'Cirugía menor', especie: 'Todos', duracion: '60 min', precio: 45000 },
  { id: 'SV004', categoria: 'Procedimientos', nombre: 'Desparasitación', especie: 'Perro / Gato', duracion: '20 min', precio: 8000 }
];

// Medicamentos y vacunas del catálogo oficial
const INITIAL_MEDICAMENTOS = [
  { id: 'ME001', categoria: 'Antibióticos', nombre: 'Amoxibay 250mg', activo: 'Amoxicilina', presentacion: 'Blíster 10 comp.', especie: 'Perro / Gato', stock: 45, precio: 4200 },
  { id: 'ME002', categoria: 'Antiparasitarios', nombre: 'Bravecto', activo: 'Fluralaner', presentacion: '1 comprimido', especie: 'Perro', stock: 20, precio: 28000 }
];

// Usuarios según los 3 roles requeridos (RBAC)
const INITIAL_USERS = [
  { id: 1, nombre: 'Administrador General', email: 'admin@sanmarcos.cl', pass: '123456', rol: 'Administrador' },
  { id: 2, nombre: 'María Recepción', email: 'recepcion@sanmarcos.cl', pass: '123456', rol: 'Recepcionista' },
  { id: 3, nombre: 'Juan Pérez', email: 'juan@gmail.com', pass: '123456', rol: 'Dueño de mascota' }
];

// Solicitudes de citas de prueba
const INITIAL_CITAS = [
  { id: 101, duenoId: 3, duenoNombre: 'Juan Pérez', mascota: 'Cachupín', especie: 'Perro', servicio: 'Consulta general', fecha: '2026-10-25', hora: '10:00', estado: 'Pendiente' }
];

export const getData = (key, initial) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getServicios = () => getData('sanmarcos_servicios', INITIAL_SERVICIOS);
export const getMedicamentos = () => getData('sanmarcos_medicamentos', INITIAL_MEDICAMENTOS);
export const getUsers = () => getData('sanmarcos_usuarios', INITIAL_USERS);

export const addUser = (newUser) => {
  const users = getUsers();
  const userWithId = { ...newUser, id: Date.now() };
  users.push(userWithId);
  saveData('sanmarcos_usuarios', users);
  return userWithId;
};

export const getCitas = () => getData('sanmarcos_citas', INITIAL_CITAS);

export const addCita = (nuevaCita) => {
  const citas = getCitas();
  const citaConId = { ...nuevaCita, id: Date.now(), estado: 'Pendiente' };
  citas.push(citaConId);
  saveData('sanmarcos_citas', citas);
  return citaConId;
};

export const updateEstadoCita = (id, nuevoEstado) => {
  const citas = getCitas();
  const actualizadas = citas.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c);
  saveData('sanmarcos_citas', actualizadas);
  return actualizadas;
};

const INITIAL_MASCOTAS = [
  { id: 1, duenoId: 3, nombre: 'Cachupín', especie: 'Perro', raza: 'Quiltro', edad: '3 años', peso: '14 kg' },
  { id: 2, duenoId: 3, nombre: 'Pelusa', especie: 'Gato', raza: 'Persa', edad: '2 años', peso: '4.2 kg' }
];

const INITIAL_FICHAS = [
  {
    id: 1,
    mascotaId: 1,
    mascotaNombre: 'Cachupín',
    duenoNombre: 'Juan Pérez',
    fecha: '2026-09-10',
    diagnostico: 'Gastroenteritis leve por ingesta inadecuada.',
    medicamentos: 'Amoxibay 250mg cada 12 hrs por 5 días.',
    vacunaAplicada: 'Antirrábica',
    vacunaVencimiento: '2026-11-15', // Próxima a vencer
    proximoControl: '2026-10-25',
    veterinario: 'Dr. Roberto Muñoz'
  }
];

// CRUD Mascotas
export const getMascotas = () => getData('sanmarcos_mascotas', INITIAL_MASCOTAS);
export const addMascota = (nueva) => {
  const lista = getMascotas();
  const registro = { ...nueva, id: Date.now() };
  lista.push(registro);
  saveData('sanmarcos_mascotas', lista);
  return registro;
};

// CRUD Fichas Clínicas
export const getFichas = () => getData('sanmarcos_fichas', INITIAL_FICHAS);
export const addFicha = (nueva) => {
  const lista = getFichas();
  const registro = { ...nueva, id: Date.now() };
  lista.push(registro);
  saveData('sanmarcos_fichas', lista);
  return registro;
};