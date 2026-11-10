import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AccesoDenegado() {
  const { usuario } = useAuth();

  return (
    <div className="container py-5 text-center my-5">
      <i className="bi bi-shield-lock text-danger display-1"></i>
      <h1 className="fw-bold mt-3">403 — Acceso denegado</h1>
      <p className="text-muted">
        {usuario ? `Tu perfil (${usuario.rol}) no tiene permiso para ver esta página.` : 'Debes iniciar sesión para ver esta página.'}
      </p>
      <Link to="/" className="btn btn-amber mt-2">
        <i className="bi bi-house-door me-1"></i> Volver a la tienda
      </Link>
    </div>
  );
}
