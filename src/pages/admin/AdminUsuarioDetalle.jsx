import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerUsuarioPorRun, actualizarUsuario, obtenerOrdenes } from '../../data/datos';
import { REGIONES, obtenerComunasPorRegion } from '../../data/regiones';
import { validarEmail, validarTexto } from '../../utils/validaciones';

export default function AdminUsuarioDetalle() {
  const { run } = useParams();
  const [usuario, setUsuario] = useState(() => obtenerUsuarioPorRun(run));
  const [form, setForm] = useState(usuario ? { ...usuario } : null);
  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  if (!usuario) {
    return (
      <div className="container my-5 text-center">
        <h2 className="fw-bold">Usuario no encontrado</h2>
        <Link to="/admin/usuarios" className="btn btn-amber mt-3">Volver a usuarios</Link>
      </div>
    );
  }

  const compras = obtenerOrdenes().filter((o) => o.cliente.correo.toLowerCase() === usuario.correo.toLowerCase());

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = (e) => {
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

    actualizarUsuario(usuario.run, form);
    setUsuario({ ...form });
    setEditando(false);
    setMensaje('Datos del usuario actualizados');
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

      {!editando ? (
        <div className="card shadow-sm border-0 p-4 mb-4">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-2"><strong>RUN:</strong> {usuario.run}</p>
              <p className="mb-2"><strong>Correo:</strong> {usuario.correo}</p>
              <p className="mb-2"><strong>Perfil:</strong> <span className="badge bg-secondary">{usuario.tipo}</span></p>
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
              <select name="tipo" className="form-select" value={form.tipo} onChange={cambiar}>
                <option value="Administrador">Administrador</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Cliente">Cliente</option>
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
                {compras.map((o) => (
                  <tr key={o.numero}>
                    <td>#{o.numero}</td>
                    <td>{o.fecha}</td>
                    <td>{o.items.length}</td>
                    <td>${o.total.toLocaleString('es-CL')}</td>
                    <td><span className={'badge ' + (o.estado === 'Pagada' ? 'bg-success' : 'bg-danger')}>{o.estado}</span></td>
                    <td><Link to={'/admin/ordenes/' + o.numero} className="btn btn-sm btn-outline-primary">Ver boleta</Link></td>
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
