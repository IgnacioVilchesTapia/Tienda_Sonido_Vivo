import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validarRutChileno, validarEmail, validarPassword } from '../../utils/validaciones';
import { REGIONES, obtenerComunasPorRegion } from '../../data/regiones';
import { listarUsuarios, crearUsuario, eliminarUsuario, ROLES, etiquetaRol } from '../../services/usuarioService';
import { mensajeDeError } from '../../services/api';

const usuarioVacio = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  password: '',
  rol: 'VENDEDOR',
  region: REGIONES[5].nombre,
  comuna: 'Viña del Mar',
  direccion: ''
};

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [filtro, setFiltro] = useState('');
  const [perfilFiltro, setPerfilFiltro] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [nuevo, setNuevo] = useState(usuarioVacio);

  useEffect(() => {
    listarUsuarios()
      .then((lista) => setUsuarios(lista))
      .catch((error) => setErrorCarga(mensajeDeError(error)))
      .finally(() => setCargando(false));
  }, []);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo: tipo, texto: texto });
    setTimeout(() => setMensaje(null), 3500);
  };

  const filtrados = usuarios.filter((u) => {
    const coincideTexto =
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(filtro.toLowerCase()) ||
      u.run.includes(filtro) ||
      u.correo.toLowerCase().includes(filtro.toLowerCase());
    const coincidePerfil = perfilFiltro ? u.rol === perfilFiltro : true;
    return coincideTexto && coincidePerfil;
  });

  const handleEliminar = async (run) => {
    if (!window.confirm(`¿Estás seguro de dar de baja al usuario con RUN ${run}?`)) return;
    try {
      await eliminarUsuario(run);
      setUsuarios(usuarios.filter((u) => u.run !== run));
      mostrarMensaje('success', `Usuario con RUN ${run} dado de baja exitosamente.`);
    } catch (error) {
      mostrarMensaje('danger', mensajeDeError(error));
    }
  };

  const handleGuardarNuevo = async (e) => {
    e.preventDefault();

    const resRut = validarRutChileno(nuevo.run);
    if (!resRut.esValido) {
      alert(resRut.mensaje);
      return;
    }

    const resEmail = validarEmail(nuevo.correo);
    if (!resEmail.esValido) {
      alert(resEmail.mensaje);
      return;
    }

    const resClave = validarPassword(nuevo.password);
    if (!resClave.esValido) {
      alert(resClave.mensaje);
      return;
    }

    try {
      const creado = await crearUsuario({
        ...nuevo,
        run: nuevo.run.replace(/[.\s-]/g, '').toUpperCase(),
        direccion: nuevo.direccion || 'Av. San Martín 452, Viña del Mar'
      });
      setUsuarios([creado, ...usuarios]);
      setMostrarModal(false);
      setNuevo(usuarioVacio);
      mostrarMensaje('success', `Usuario ${creado.nombre} ${creado.apellidos} registrado con éxito.`);
    } catch (error) {
      alert(mensajeDeError(error));
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Mantenedor de Usuarios</h1>
          <p className="text-muted mb-0">Administración de colaboradores, vendedores y clientes</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/dashboard" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i> Dashboard
          </Link>
          <button className="btn btn-amber fw-bold" onClick={() => setMostrarModal(true)}>
            <i className="bi bi-person-plus me-1"></i> Nuevo Usuario
          </button>
        </div>
      </div>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje(null)}></button>
        </div>
      )}

      <div className="card shadow-sm p-3 mb-4 bg-white border-0">
        <div className="row g-3">
          <div className="col-md-7">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por RUN, nombre, apellidos o correo…"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <select
              className="form-select"
              value={perfilFiltro}
              onChange={(e) => setPerfilFiltro(e.target.value)}
            >
              <option value="">Todos los perfiles</option>
              {ROLES.map((r) => (
                <option key={r.valor} value={r.valor}>{r.etiqueta}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {cargando && <div className="alert alert-info">Cargando usuarios desde el servidor...</div>}
      {errorCarga && <div className="alert alert-danger">{errorCarga}</div>}

      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>RUN</th>
                <th>Nombre y Apellidos</th>
                <th>Correo Electrónico</th>
                <th>Perfil</th>
                <th>Ubicación</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.run}>
                  <td className="fw-bold font-monospace">{u.run}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>
                    <span className={`badge ${u.rol === 'ADMIN' ? 'bg-danger' : u.rol === 'VENDEDOR' ? 'bg-primary' : 'bg-secondary'}`}>
                      {etiquetaRol(u.rol)}
                    </span>
                  </td>
                  <td>{u.comuna}, {u.region}</td>
                  <td className="text-center text-nowrap">
                    <Link to={'/admin/usuarios/' + u.run} className="btn btn-outline-primary btn-sm me-1" title="Ver usuario">
                      <i className="bi bi-eye"></i>
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      title="Dar de baja usuario"
                      onClick={() => handleEliminar(u.run)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white text-muted small p-3">
          Mostrando {filtrados.length} de {usuarios.length} cuentas registradas.
        </div>
      </div>

      {mostrarModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-tolex text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-badge me-2"></i>Alta de Nuevo Usuario
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              <form onSubmit={handleGuardarNuevo}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">RUN (sin puntos ni guion) *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="190110222"
                        required
                        value={nuevo.run}
                        onChange={(e) => setNuevo({ ...nuevo, run: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Perfil de Usuario *</label>
                      <select
                        className="form-select"
                        value={nuevo.rol}
                        onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
                      >
                        {ROLES.map((r) => (
                          <option key={r.valor} value={r.valor}>{r.etiqueta}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ignacio"
                        required
                        value={nuevo.nombre}
                        onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Apellidos *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Vilches Tapia"
                        required
                        value={nuevo.apellidos}
                        onChange={(e) => setNuevo({ ...nuevo, apellidos: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Correo Institucional *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="i.vilches@duoc.cl"
                        required
                        value={nuevo.correo}
                        onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Contraseña inicial *</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="4 a 10 caracteres"
                        required
                        value={nuevo.password}
                        onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Región</label>
                      <select
                        className="form-select"
                        value={nuevo.region}
                        onChange={(e) => {
                          const reg = e.target.value;
                          const comunas = obtenerComunasPorRegion(reg);
                          setNuevo({ ...nuevo, region: reg, comuna: comunas[0] || '' });
                        }}
                      >
                        {REGIONES.map((r) => (
                          <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Comuna</label>
                      <select
                        className="form-select"
                        value={nuevo.comuna}
                        onChange={(e) => setNuevo({ ...nuevo, comuna: e.target.value })}
                      >
                        {obtenerComunasPorRegion(nuevo.region).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Av. San Martín 452"
                        value={nuevo.direccion}
                        onChange={(e) => setNuevo({ ...nuevo, direccion: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-amber fw-bold px-4">
                    Guardar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
