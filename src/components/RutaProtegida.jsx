import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RutaProtegida({ roles, children }) {
  const { estaAutenticado, tieneRol } = useAuth();
  const location = useLocation();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (roles && !tieneRol(...roles)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
}
