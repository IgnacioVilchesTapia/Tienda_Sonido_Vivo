import api from './api';

export async function listarCategorias() {
  const respuesta = await api.get('/categorias');
  return respuesta.data;
}

export async function obtenerCategoria(id) {
  const respuesta = await api.get(`/categorias/${id}`);
  return respuesta.data;
}

export async function crearCategoria(categoria) {
  const respuesta = await api.post('/categorias', categoria);
  return respuesta.data;
}

export async function actualizarCategoria(id, categoria) {
  const respuesta = await api.put(`/categorias/${id}`, categoria);
  return respuesta.data;
}

export async function eliminarCategoria(id) {
  await api.delete(`/categorias/${id}`);
}
