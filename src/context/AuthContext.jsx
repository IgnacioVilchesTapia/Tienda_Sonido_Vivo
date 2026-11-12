import { createContext, useContext, useEffect, useState } from 'react';
import { CLAVE_TOKEN, CLAVE_REFRESH, CLAVE_USUARIO, guardarSesion, borrarSesion, renovarToken } from '../services/api';
import { iniciarSesion, registrarCliente } from '../services/authService';

const AuthContext = createContext();

export function leerExpiracion(token) {
  if (!token) return 0;
  try {
    const parte = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const datos = JSON.parse(atob(parte));
    return datos.exp * 1000;
  } catch {
    return 0;
  }
}

function leerSesionGuardada() {
  const token = localStorage.getItem(CLAVE_TOKEN);
  const refreshToken = localStorage.getItem(CLAVE_REFRESH);
  const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);
  const ahora = Date.now();

  const tokenVigente = leerExpiracion(token) > ahora;
  const refreshVigente = leerExpiracion(refreshToken) > ahora;

  if (!usuarioGuardado || (!tokenVigente && !refreshVigente)) {
    borrarSesion();
    return null;
  }
  try {
    return { usuario: JSON.parse(usuarioGuardado), token: token };
  } catch {
    borrarSesion();
    return null;
  }
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => leerSesionGuardada());

  useEffect(() => {
    const alRenovar = () => setSesion(leerSesionGuardada());
    const alExpirar = () => setSesion(null);
    window.addEventListener('sonidoVivo:sesion-renovada', alRenovar);
    window.addEventListener('sonidoVivo:sesion-expirada', alExpirar);

    const token = localStorage.getItem(CLAVE_TOKEN);
    const refreshToken = localStorage.getItem(CLAVE_REFRESH);
    if (refreshToken && leerExpiracion(token) <= Date.now()) {
      renovarToken(refreshToken)
        .then((datos) => setSesion({ usuario: datos.usuario, token: datos.token }))
        .catch(() => {
          borrarSesion();
          setSesion(null);
        });
    }

    return () => {
      window.removeEventListener('sonidoVivo:sesion-renovada', alRenovar);
      window.removeEventListener('sonidoVivo:sesion-expirada', alExpirar);
    };
  }, []);

  const login = async (correo, password) => {
    const datos = await iniciarSesion(correo, password);
    guardarSesion(datos);
    setSesion({ usuario: datos.usuario, token: datos.token });
    return datos.usuario;
  };

  const registrar = async (formulario) => {
    const datos = await registrarCliente(formulario);
    guardarSesion(datos);
    setSesion({ usuario: datos.usuario, token: datos.token });
    return datos.usuario;
  };

  const logout = () => {
    borrarSesion();
    setSesion(null);
  };

  const actualizarUsuarioSesion = (usuario) => {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    setSesion((anterior) => ({ ...anterior, usuario: usuario }));
  };

  const tieneRol = (...roles) => {
    return sesion !== null && roles.includes(sesion.usuario.rol);
  };

  const valor = {
    usuario: sesion ? sesion.usuario : null,
    token: sesion ? sesion.token : null,
    estaAutenticado: sesion !== null,
    login,
    registrar,
    logout,
    tieneRol,
    actualizarUsuarioSesion
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
