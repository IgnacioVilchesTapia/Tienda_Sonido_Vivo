import { useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerOrdenes } from '../../data/datos';

export default function AdminOrdenes() {
  const ordenes = obtenerOrdenes();
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState('');

  const lista = ordenes.filter((o) => {
    const texto = (o.numero + ' ' + o.cliente.nombre + ' ' + o.cliente.apellidos + ' ' + o.cliente.correo).toLowerCase();
    return texto.includes(buscar.toLowerCase()) && (estado === '' || o.estado === estado);
  });

  let totalVendido = 0;
  ordenes.forEach((o) => {
    if (o.estado === 'Pagada') totalVendido += o.total;
  });

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Órdenes y boletas</h1>
          <p className="text-muted mb-0">Compras hechas en la tienda</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Dashboard
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <small className="text-muted">Órdenes registradas</small>
            <h3 className="fw-bold mb-0">{ordenes.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <small className="text-muted">Total vendido</small>
            <h3 className="fw-bold mb-0 text-success">${totalVendido.toLocaleString('es-CL')}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <small className="text-muted">Pagos rechazados</small>
            <h3 className="fw-bold mb-0 text-danger">{ordenes.filter((o) => o.estado === 'Rechazada').length}</h3>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-3 mb-3 border-0">
        <div className="row g-2">
          <div className="col-md-8">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por número, cliente o correo"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="Pagada">Pagada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>N° orden</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Comuna</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((o) => (
                <tr key={o.numero}>
                  <td className="fw-bold">#{o.numero}</td>
                  <td>{o.fecha}</td>
                  <td>
                    {o.cliente.nombre} {o.cliente.apellidos}
                    <div className="small text-muted">{o.cliente.correo}</div>
                  </td>
                  <td>{o.direccion.comuna}</td>
                  <td>${o.total.toLocaleString('es-CL')}</td>
                  <td>
                    <span className={'badge ' + (o.estado === 'Pagada' ? 'bg-success' : 'bg-danger')}>{o.estado}</span>
                  </td>
                  <td>
                    <Link to={'/admin/ordenes/' + o.numero} className="btn btn-outline-primary btn-sm">
                      Ver boleta
                    </Link>
                  </td>
                </tr>
              ))}
              {lista.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">No hay órdenes con ese filtro</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
