import api from './api';

export async function obtenerReporte() {
  const respuesta = await api.get('/reportes');
  return respuesta.data;
}
