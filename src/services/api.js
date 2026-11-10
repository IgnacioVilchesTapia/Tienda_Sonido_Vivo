import axios from 'axios';
import { API_URL } from './config';

export const CLAVE_TOKEN = 'sonidoVivo.token';
export const CLAVE_REFRESH = 'sonidoVivo.refreshToken';
export const CLAVE_USUARIO = 'sonidoVivo.usuario';

const RUTAS_SIN_REINTENTO = ['/auth/login', '/auth/registro', '/auth/refresh'];

const api = axios.create({ baseURL: API_URL });

export function guardarSesion(datos) {
  localStorage.setItem(CLAVE_TOKEN, datos.token);
  localStorage.setItem(CLAVE_REFRESH, datos.refreshToken);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(datos.usuario));
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_REFRESH);
  localStorage.removeItem(CLAVE_USUARIO);
}

export async function renovarToken(refreshToken) {
  const respuesta = await axios.post(API_URL + '/auth/refresh', { refreshToken: refreshToken });
  guardarSesion(respuesta.data);
  return respuesta.data;
}

export function mensajeDeError(error) {
  if (error.response && error.response.data && error.response.data.mensaje) {
    return error.response.data.mensaje;
  }
  if (error.response) {
    return 'El servidor respondió con un error (' + error.response.status + ').';
  }
  return 'No se pudo conectar con el servidor. Intenta de nuevo en unos minutos.';
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem(CLAVE_REFRESH);
    const puedeReintentar = original && !original.reintentado && !RUTAS_SIN_REINTENTO.includes(original.url);

    if (error.response && error.response.status === 401 && refreshToken && puedeReintentar) {
      original.reintentado = true;
      try {
        const datos = await renovarToken(refreshToken);
        window.dispatchEvent(new Event('sonidoVivo:sesion-renovada'));
        original.headers.Authorization = 'Bearer ' + datos.token;
        return api(original);
      } catch {
        borrarSesion();
        window.dispatchEvent(new Event('sonidoVivo:sesion-expirada'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
