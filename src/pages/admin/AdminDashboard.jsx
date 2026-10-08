import { Link } from 'react-router-dom';
import { PRODUCTOS, USUARIOS } from '../../data/datos';

export default function AdminDashboard() {
  const criticos = PRODUCTOS.filter((p) => p.stock <= p.stockCritico);
  const totalStock = PRODUCTOS.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Panel de Control — Sonido Vivo</h1>
          <p className="text-muted mb-0">Resumen operativo de inventario y personal</p>
        </div>
        <span className="badge bg-success px-3 py-2">Sistema Operativo</span>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-primary border-4 p-3">
            <span className="text-muted small fw-semibold">TOTAL PRODUCTOS</span>
            <h3 className="fw-bold my-2">{PRODUCTOS.length}</h3>
            <span className="text-secondary small">{totalStock} unidades en inventario</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-danger border-4 p-3">
            <span className="text-muted small fw-semibold">STOCK CRÍTICO</span>
            <h3 className="fw-bold my-2 text-danger">{criticos.length}</h3>
            <span className="text-secondary small">Productos requieren reposición</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-success border-4 p-3">
            <span className="text-muted small fw-semibold">USUARIOS REGISTRADOS</span>
            <h3 className="fw-bold my-2">{USUARIOS.length}</h3>
            <span className="text-secondary small">Administradores, vendedores y clientes</span>
          </div>
        </div>
      </div>

      {/* Alerta de Stock Crítico */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
          <span className="fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>Alerta de Inventario Crítico</span>
          <span className="badge bg-light text-danger">{criticos.length} artículos</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Stock Crítico</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {criticos.map((p) => (
                  <tr key={p.codigo}>
                    <td className="fw-bold text-monospace">{p.codigo}</td>
                    <td>{p.nombre} ({p.marca})</td>
                    <td><span className="badge bg-secondary">{p.categoria}</span></td>
                    <td className="text-danger fw-bold">{p.stock}</td>
                    <td>{p.stockCritico}</td>
                    <td><span className="badge bg-danger">Reponer urgente</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Accesos rápidos a Mantenedores */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm text-center">
            <h5>Mantenedor de Productos</h5>
            <p className="text-muted small">Crear, actualizar precios, stock y categorías</p>
            <Link to="/admin/productos" className="btn btn-outline-primary">
              <i className="bi bi-box-seam me-1"></i> Gestionar Productos
            </Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm text-center">
            <h5>Mantenedor de Usuarios</h5>
            <p className="text-muted small">Control de roles, RUN, datos personales y accesos</p>
            <Link to="/admin/usuarios" className="btn btn-outline-primary">
              <i className="bi bi-people me-1"></i> Gestionar Usuarios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
