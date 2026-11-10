import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validarRutChileno, validarEmail, validarPassword, validarTexto } from '../utils/validaciones';
import { REGIONES, obtenerComunasPorRegion } from '../data/regiones';
import { useAuth } from '../context/AuthContext';
import { mensajeDeError } from '../services/api';

export default function Registro() {
  const navigate = useNavigate();
  const { registrar } = useAuth();

  const [formulario, setFormulario] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    clave: '',
    region: '',
    comuna: '',
    direccion: ''
  });

  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [comunasDisponibles, setComunasDisponibles] = useState([]);

  const handleCambioRegion = (e) => {
    const reg = e.target.value;
    setFormulario({ ...formulario, region: reg, comuna: '' });
    setComunasDisponibles(obtenerComunasPorRegion(reg));
  };

  const handleBlurRut = () => {
    if (formulario.run) {
      const res = validarRutChileno(formulario.run);
      if (!res.esValido) {
        setErrores((prev) => ({ ...prev, run: res.mensaje }));
      } else {
        setErrores((prev) => {
          const resto = { ...prev };
          delete resto.run;
          return resto;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGlobal('');

    const nuevosErrores = {};

    const resRut = validarRutChileno(formulario.run);
    if (!resRut.esValido) nuevosErrores.run = resRut.mensaje;

    const resNombre = validarTexto(formulario.nombre, 2, 50, 'El nombre');
    if (!resNombre.esValido) nuevosErrores.nombre = resNombre.mensaje;

    const resApellidos = validarTexto(formulario.apellidos, 2, 100, 'Los apellidos');
    if (!resApellidos.esValido) nuevosErrores.apellidos = resApellidos.mensaje;

    const resEmail = validarEmail(formulario.email);
    if (!resEmail.esValido) nuevosErrores.email = resEmail.mensaje;

    const resClave = validarPassword(formulario.clave);
    if (!resClave.esValido) nuevosErrores.clave = resClave.mensaje;

    if (!formulario.region) nuevosErrores.region = 'Debes seleccionar una región.';
    if (!formulario.comuna) nuevosErrores.comuna = 'Debes seleccionar una comuna.';

    const resDir = validarTexto(formulario.direccion, 5, 300, 'La dirección');
    if (!resDir.esValido) nuevosErrores.direccion = resDir.mensaje;

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await registrar({
        run: formulario.run.replace(/[.\s-]/g, '').toUpperCase(),
        nombre: formulario.nombre.trim(),
        apellidos: formulario.apellidos.trim(),
        correo: formulario.email.trim(),
        password: formulario.clave,
        region: formulario.region,
        comuna: formulario.comuna,
        direccion: formulario.direccion.trim()
      });
      navigate('/');
    } catch (error) {
      setErrorGlobal(mensajeDeError(error));
      setEnviando(false);
    }
  };

  return (
    <div className="container py-5 my-3">
      <div className="card shadow-sm border-0 p-4 mx-auto rounded-3" style={{ maxWidth: '620px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1">Registro de Usuario</h2>
          <p className="text-muted small">Crea tu cuenta para comprar instrumentos y gestionar despachos</p>
        </div>

        {errorGlobal && (
          <div className="alert alert-danger py-2 small" role="alert">
            {errorGlobal}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-semibold text-muted">RUN (sin puntos ni guion)</label>
              <input
                type="text"
                className={`form-control ${errores.run ? 'is-invalid' : ''}`}
                placeholder="Ej: 190110222"
                value={formulario.run}
                onChange={(e) => setFormulario({ ...formulario, run: e.target.value })}
                onBlur={handleBlurRut}
              />
              {errores.run && <div className="invalid-feedback">{errores.run}</div>}
              <div className="form-text small" style={{ fontSize: '0.78rem' }}>
                Validado con algoritmo chileno Módulo 11 (7 a 9 caracteres).
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Nombre</label>
              <input
                type="text"
                className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                placeholder="Carla"
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              />
              {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Apellidos</label>
              <input
                type="text"
                className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`}
                placeholder="Pizarro Muñoz"
                value={formulario.apellidos}
                onChange={(e) => setFormulario({ ...formulario, apellidos: e.target.value })}
              />
              {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Correo Electrónico</label>
              <input
                type="email"
                className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                placeholder="nombre@duoc.cl"
                value={formulario.email}
                onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
              />
              {errores.email && <div className="invalid-feedback">{errores.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Contraseña</label>
              <input
                type="password"
                className={`form-control ${errores.clave ? 'is-invalid' : ''}`}
                placeholder="4 a 10 caracteres"
                value={formulario.clave}
                onChange={(e) => setFormulario({ ...formulario, clave: e.target.value })}
              />
              {errores.clave && <div className="invalid-feedback">{errores.clave}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Región</label>
              <select
                className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                value={formulario.region}
                onChange={handleCambioRegion}
              >
                <option value="">Selecciona tu región</option>
                {REGIONES.map((r) => (
                  <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                ))}
              </select>
              {errores.region && <div className="invalid-feedback">{errores.region}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Comuna</label>
              <select
                className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                value={formulario.comuna}
                disabled={!formulario.region}
                onChange={(e) => setFormulario({ ...formulario, comuna: e.target.value })}
              >
                <option value="">Selecciona tu comuna</option>
                {comunasDisponibles.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold text-muted">Dirección de Despacho</label>
              <input
                type="text"
                className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                placeholder="Calle, número, departamento o casa"
                value={formulario.direccion}
                onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })}
              />
              {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-amber w-100 fw-bold py-2 mt-4 shadow-sm" disabled={enviando}>
            {enviando ? 'Creando la cuenta…' : 'Crear Cuenta de Cliente'}
          </button>
        </form>

        <div className="text-center border-top pt-3 mt-4 small text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="fw-semibold text-decoration-none">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}