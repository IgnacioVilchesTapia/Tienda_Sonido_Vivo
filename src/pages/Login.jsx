import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validarEmail, validarPassword } from '../utils/validaciones';

export default function Login() {
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({ correo: '', clave: '' });
  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorGlobal('');

    const resEmail = validarEmail(credenciales.correo);
    const resClave = validarPassword(credenciales.clave);

    const nuevosErrores = {};
    if (!resEmail.esValido) nuevosErrores.correo = resEmail.mensaje;
    if (!resClave.esValido) nuevosErrores.clave = resClave.mensaje;

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    // Validación simulada de credenciales
    if (credenciales.correo.toLowerCase().includes('admin') || credenciales.correo === 'c.pizarro@duoc.cl') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container py-5 my-4">
      <div className="card shadow-sm border-0 p-4 mx-auto rounded-3" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div className="bg-warning text-dark rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 50, height: 50 }}>
            <i className="bi bi-person-fill fs-3"></i>
          </div>
          <h2 className="fw-bold mb-1">Iniciar Sesión</h2>
          <p className="text-muted small">Ingresa con tu correo institucional o personal</p>
        </div>

        {errorGlobal && (
          <div className="alert alert-danger py-2 small" role="alert">
            {errorGlobal}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Correo Electrónico</label>
            <input
              type="email"
              className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
              placeholder="ejemplo@duoc.cl"
              value={credenciales.correo}
              onChange={(e) => setCredenciales({ ...credenciales, correo: e.target.value })}
            />
            {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
            <div className="form-text small" style={{ fontSize: '0.78rem' }}>
              Permitidos: <code>@duoc.cl</code>, <code>@profesor.duoc.cl</code>, <code>@gmail.com</code>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Contraseña</label>
            <input
              type="password"
              className={`form-control ${errores.clave ? 'is-invalid' : ''}`}
              placeholder="Entre 4 y 10 caracteres"
              value={credenciales.clave}
              onChange={(e) => setCredenciales({ ...credenciales, clave: e.target.value })}
            />
            {errores.clave && <div className="invalid-feedback">{errores.clave}</div>}
          </div>

          <button type="submit" className="btn btn-amber w-100 fw-bold py-2 mb-3">
            Ingresar a Sonido Vivo
          </button>
        </form>

        <div className="text-center border-top pt-3 small text-muted">
          ¿No tienes una cuenta aún?{' '}
          <Link to="/registro" className="fw-semibold text-decoration-none">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}