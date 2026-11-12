import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { REGIONES, obtenerComunasPorRegion } from '../../data/regiones';
import { validarEmail, validarTexto } from '../../utils/validaciones';
import { obtenerUsuario, actualizarUsuario, ROLES, etiquetaRol } from '../../services/usuarioService';
import { mensajeDeError } from '../../services/api';
import { listarBoletas, buscarEstado, formatearFecha } from '../../services/boletaService';

export default function AdminUsuarioDetalle() {
  const { run } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [form, setForm] = useState(null);
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    obtenerUsuario(run)
        .then((datos) => setUsuario(datos))
        .catch((error) => setErrorCarga(mensajeDeError(error)))
        .finally(() => setCargando(false));
    listarBoletas()
        .then((lista) => setCompras(lista.filter((b) => b.clienteRun === run)))
        .catch(() => setCompras([]));
  }, [run]);

  if (cargando) {
    return <div className="container my-5 text-center text-muted">Cargando usuario...</div>;
  }

  if (!usuario) {
    return (
        <div className="container my-5 text-center">
          <h2 className="fw-bold">Usuario no encontrado</h2>
          <p className="text-muted">{errorCarga}</p>
          <Link to="/admin/usuarios" className="btn btn-amber mt-3">Volver a usuarios</Link>
        </div>
    );
  }


  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e) => {
    e.preventDefault();
    const err = {};
    const n = validarTexto(form.nombre, 2, 50, 'El nombre');
    if (!n.esValido) err.nombre = n.mensaje;
    const a = validarTexto(form.apellidos, 2, 100, 'Los apellidos');
    if (!a.esValido) err.apellidos = a.mensaje;
    const c = validarEmail(form.correo);
    if (!c.esValido) err.correo = c.mensaje;
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    try {
      const actualizado = await actualizarUsuario(usuario.run, form);
      setUsuario(actualizado);
      setEditando(false);
      setErrores({});
      setMensaje('Datos del usuario actualizados');
    } catch (error) {
      setErrores({ general: mensajeDeError(error) });
    }
  };

  return (
      <div className="container my-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <h1 className="h2 fw-bold mb-1">{usuario.nombre} {usuario.apellidos}</h1>
            <p className="text-muted mb-0">Ficha completa de la cuenta</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/usuarios" className="btn btn-outline-secondary">Volver al listado</Link>
            {!editando && (
                <button className="btn btn-amber fw-bold" onClick={() => { setForm({ ...usuario }); setEditando(true); }}>
                  Editar
                </button>
            )}
          </div>
        </div>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {errores.general && <div className="alert alert-danger">{errores.general}</div>}

        {!editando ? (
            <div className="card shadow-sm border-0 p-4 mb-4">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2"><strong>RUN:</strong> {usuario.run}</p>
                  <p className="mb-2"><strong>Correo:</strong> {usuario.correo}</p>
                  <p className="mb-2"><strong>Perfil:</strong> <span className="badge bg-secondary">{etiquetaRol(usuario.rol)}</span></p>
                  <p className="mb-2"><strong>Fecha de nacimiento:</strong> {usuario.nacimiento || 'Sin dato'}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2"><strong>Región:</strong> {usuario.region}</p>
                  <p className="mb-2"><strong>Comuna:</strong> {usuario.comuna}</p>
                  <p className="mb-2"><strong>Dirección:</strong> {usuario.direccion}</p>
                </div>
              </div>
            </div>
        ) : (
            <form className="card shadow-sm border-0 p-4 mb-4" onSubmit={guardar} noValidate>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">RUN</label>
                  <input className="form-control" value={form.run} disabled />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Nombre</label>
                  <input name="nombre" className={'form-control ' + (errores.nombre ? 'is-invalid' : '')} value={form.nombre} onChange={cambiar} />
                  <div className="invalid-feedback">{errores.nombre}</div>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Apellidos</label>
                  <input name="apellidos" className={'form-control ' + (errores.apellidos ? 'is-invalid' : '')} value={form.apellidos} onChange={cambiar} />
                  <div className="invalid-feedback">{errores.apellidos}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Correo</label>
                  <input name="correo" className={'form-control ' + (errores.correo ? 'is-invalid' : '')} value={form.correo} onChange={cambiar} />
                  <div className="invalid-feedback">{errores.correo}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Perfil</label>
                  <select name="rol" className="form-select" value={form.rol} onChange={cambiar}>
                    {ROLES.map((r) => (
                        <option key={r.valor} value={r.valor}>{r.etiqueta}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Región</label>
                  <select
                      className="form-select"
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value, comuna: obtenerComunasPorRegion(e.target.value)[0] || '' })}
                  >
                    {REGIONES.map((r) => (
                        <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Comuna</label>
                  <select name="comuna" className="form-select" value={form.comuna} onChange={cambiar}>
                    {obtenerComunasPorRegion(form.region).map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Dirección</label>
                  <input name="direccion" className="form-control" value={form.direccion} onChange={cambiar} />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
                <button type="submit" className="btn btn-amber fw-bold">Guardar</button>
              </div>
            </form>
        )}

        <h4 className="fw-bold mb-3">Historial de compras</h4>
        {compras.length === 0 ? (
            <p className="text-muted">Este usuario todavía no tiene compras.</p>
        ) : (
            <div className="card shadow-sm border-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                  <tr>
                    <th>N° orden</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {compras.map((b) => (
                      <tr key={b.numero}>
                        <td>#{b.numero}</td>
                        <td>{formatearFecha(b.fecha)}</td>
                        <td>{b.detalles.length}</td>
                        <td>${b.total.toLocaleString('es-CL')}</td>
                        <td><span className={'badge ' + buscarEstado(b.estado).color}>{buscarEstado(b.estado).etiqueta}</span></td>
                        <td><Link to={'/admin/ordenes/' + b.numero} className="btn btn-sm btn-outline-primary">Ver boleta</Link></td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}
      </div>
  );
}

