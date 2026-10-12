import { useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerUsuarios, actualizarUsuario, obtenerUsuarioActivo, guardarUsuarioActivo } from '../../data/datos';
import { validarEmail, validarPassword, validarTexto } from '../../utils/validaciones';

export default function AdminPerfil() {
  const [admin, setAdmin] = useState(() => {
    const sesion = obtenerUsuarioActivo();
    const usuarios = obtenerUsuarios();
    const logeado = sesion ? usuarios.find((u) => u.correo === sesion.correo && u.tipo === 'Administrador') : null;
    return logeado || usuarios.find((u) => u.tipo === 'Administrador');
  });
  const [datos, setDatos] = useState(admin ? { ...admin } : null);
  const [claves, setClaves] = useState({ actual: '', nueva: '', repetir: '' });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  if (!admin) {
    return (
      <div className="container my-5 text-center">
        <h2 className="fw-bold">No hay un administrador registrado</h2>
        <Link to="/admin/dashboard" className="btn btn-amber mt-3">Volver</Link>
      </div>
    );
  }

  const guardarDatos = (e) => {
    e.preventDefault();
    const err = {};
    const n = validarTexto(datos.nombre, 2, 50, 'El nombre');
    if (!n.esValido) err.nombre = n.mensaje;
    const a = validarTexto(datos.apellidos, 2, 100, 'Los apellidos');
    if (!a.esValido) err.apellidos = a.mensaje;
    const c = validarEmail(datos.correo);
    if (!c.esValido) err.correo = c.mensaje;
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    actualizarUsuario(admin.run, datos);
    const sesion = obtenerUsuarioActivo();
    if (sesion && sesion.correo === admin.correo) guardarUsuarioActivo({ ...datos });
    setAdmin({ ...datos });
    setMensaje('Perfil actualizado');
  };

  const cambiarClave = (e) => {
    e.preventDefault();
    if (claves.actual === '') {
      alert('Ingresa tu contraseña actual');
      return;
    }
    const res = validarPassword(claves.nueva);
    if (!res.esValido) {
      alert(res.mensaje);
      return;
    }
    if (claves.nueva !== claves.repetir) {
      alert('Las contraseñas no coinciden');
      return;
    }
    setClaves({ actual: '', nueva: '', repetir: '' });
    setMensaje('Contraseña cambiada');
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h2 fw-bold mb-0">Mi perfil</h1>
        <Link to="/admin/dashboard" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Dashboard
        </Link>
      </div>

      {mensaje && (
        <div className="alert alert-success alert-dismissible">
          {mensaje}
          <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <div
              className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold fs-3"
              style={{ width: 80, height: 80 }}
            >
              {admin.nombre.charAt(0)}{admin.apellidos.charAt(0)}
            </div>
            <h5 className="fw-bold mb-0">{admin.nombre} {admin.apellidos}</h5>
            <p className="text-muted small">{admin.correo}</p>
            <span className="badge bg-danger align-self-center">{admin.tipo}</span>
            <hr />
            <p className="small text-muted mb-0">RUN {admin.run}</p>
            <p className="small text-muted">{admin.comuna}, {admin.region}</p>
          </div>
        </div>

        <div className="col-lg-8">
          <form className="card shadow-sm border-0 p-4 mb-4" onSubmit={guardarDatos} noValidate>
            <h5 className="fw-bold mb-3">Datos personales</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small">Nombre</label>
                <input className={'form-control ' + (errores.nombre ? 'is-invalid' : '')} value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
                <div className="invalid-feedback">{errores.nombre}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small">Apellidos</label>
                <input className={'form-control ' + (errores.apellidos ? 'is-invalid' : '')} value={datos.apellidos} onChange={(e) => setDatos({ ...datos, apellidos: e.target.value })} />
                <div className="invalid-feedback">{errores.apellidos}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small">Correo</label>
                <input className={'form-control ' + (errores.correo ? 'is-invalid' : '')} value={datos.correo} onChange={(e) => setDatos({ ...datos, correo: e.target.value })} />
                <div className="invalid-feedback">{errores.correo}</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small">Dirección</label>
                <input className="form-control" value={datos.direccion} onChange={(e) => setDatos({ ...datos, direccion: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-amber fw-bold mt-3 align-self-start">Guardar datos</button>
          </form>

          <form className="card shadow-sm border-0 p-4" onSubmit={cambiarClave}>
            <h5 className="fw-bold mb-3">Cambiar contraseña</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small">Contraseña actual</label>
                <input type="password" className="form-control" value={claves.actual} onChange={(e) => setClaves({ ...claves, actual: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Nueva contraseña</label>
                <input type="password" className="form-control" value={claves.nueva} onChange={(e) => setClaves({ ...claves, nueva: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Repetir contraseña</label>
                <input type="password" className="form-control" value={claves.repetir} onChange={(e) => setClaves({ ...claves, repetir: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-outline-dark mt-3 align-self-start">Cambiar contraseña</button>
          </form>
        </div>
      </div>
    </div>
  );
}
