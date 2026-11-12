import api from './api';

export const ROLES = [
  { valor: 'ADMIN', etiqueta: 'Administrador' },
  { valor: 'VENDEDOR', etiqueta: 'Vendedor' },
  { valor: 'CLIENTE', etiqueta: 'Cliente' }
];

export function etiquetaRol(rol) {
  const encontrado = ROLES.find((r) => r.valor === rol);
  return encontrado ? encontrado.etiqueta : rol;
}

export async function listarUsuarios() {
  const respuesta = await api.get('/usuarios');
  return respuesta.data;
}

export async function obtenerUsuario(run) {
  const respuesta = await api.get('/usuarios/' + run);
  return respuesta.data;
}

export async function crearUsuario(usuario) {
  const respuesta = await api.post('/usuarios', usuario);
  return respuesta.data;
}

export async function actualizarUsuario(run, usuario) {
  const respuesta = await api.put('/usuarios/' + run, usuario);
  return respuesta.data;
}

export async function actualizarMiPerfil(usuario) {
  const respuesta = await api.put('/usuarios/me', usuario);
  return respuesta.data;
}

export async function eliminarUsuario(run) {
  await api.delete('/usuarios/' + run);
}
