import api from './api';

export async function listarProductos(filtros = {}) {
  const params = {};
  if (filtros.categoria) params.categoria = filtros.categoria;
  if (filtros.q) params.q = filtros.q;
  const respuesta = await api.get('/productos', { params });
  return respuesta.data;
}

export async function obtenerProducto(codigo) {
  const respuesta = await api.get(`/productos/${codigo}`);
  return respuesta.data;
}

export async function listarOfertas() {
  const respuesta = await api.get('/productos/ofertas');
  return respuesta.data;
}

export async function listarCriticos() {
  const respuesta = await api.get('/productos/criticos');
  return respuesta.data;
}

export async function crearProducto(producto) {
  const respuesta = await api.post('/productos', producto);
  return respuesta.data;
}

export async function actualizarProducto(codigo, producto) {
  const respuesta = await api.put(`/productos/${codigo}`, producto);
  return respuesta.data;
}

export async function eliminarProducto(codigo) {
  await api.delete(`/productos/${codigo}`);
}
