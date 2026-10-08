import { useState } from 'react';
import { Link } from 'react-router-dom';
import { USUARIOS } from '../../data/datos';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(USUARIOS);
  const [filtro, setFiltro] = useState('');

  const filtrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    u.apellidos.toLowerCase().includes(filtro.toLowerCase()) ||
    u.run.includes(filtro) ||
    u.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleEliminar = (run) => {
    if (window.confirm(`¿Estás seguro de dar de baja al usuario con RUN ${run}?`)) {
      setUsuarios(usuarios.filter((u) => u.run !== run));
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Mantenedor de Usuarios</h1>
          <p className="text-muted mb-0">Gestión de cuentas, perfiles y permisos</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Volver al Dashboard
        </Link>
      </div>

      <div className="card shadow-sm p-3 mb-4">
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por RUN, nombre, apellidos o correo…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>RUN</th>
                <th>Nombre Completo</th>
                <th>Correo Institucional</th>
                <th>Tipo de Perfil</th>
                <th>Comuna / Región</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.run}>
                  <td className="fw-bold">{u.run}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>
                    <span className={`badge ${u.tipo === 'Administrador' ? 'bg-danger' : u.tipo === 'Vendedor' ? 'bg-primary' : 'bg-secondary'}`}>
                      {u.tipo}
                    </span>
                  </td>
                  <td>{u.comuna}, {u.region}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
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
      </div>
    </div>
  );
}
