import api from './api';

export async function iniciarSesion(correo, password) {
  const respuesta = await api.post('/auth/login', { correo: correo, password: password });
  return respuesta.data;
}

export async function registrarCliente(datos) {
  const respuesta = await api.post('/auth/registro', datos);
  return respuesta.data;
}

export async function obtenerMiUsuario() {
  const respuesta = await api.get('/auth/me');
  return respuesta.data;
}
