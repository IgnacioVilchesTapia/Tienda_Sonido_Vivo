import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarBoletas, ESTADOS, buscarEstado, formatearFecha } from '../../services/boletaService';
import { mensajeDeError } from '../../services/api';

export default function AdminOrdenes() {
  const [boletas, setBoletas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    listarBoletas()
        .then((lista) => setBoletas(lista))
        .catch((err) => setError(mensajeDeError(err)))
        .finally(() => setCargando(false));
  }, []);

  const lista = boletas.filter((b) => {
    const texto = (b.numero + ' ' + b.clienteNombre + ' ' + b.clienteCorreo).toLowerCase();
    return texto.includes(buscar.toLowerCase()) && (estado === '' || b.estado === estado);
  });

  let totalVendido = 0;
  boletas.forEach((b) => {
    if (b.estado !== 'ANULADA') totalVendido += b.total;
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

        {cargando && <div className="alert alert-info">Cargando las boletas desde el servidor...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <small className="text-muted">Boletas registradas</small>
              <h3 className="fw-bold mb-0">{boletas.length}</h3>
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
              <small className="text-muted">Boletas anuladas</small>
              <h3 className="fw-bold mb-0 text-danger">{boletas.filter((b) => b.estado === 'ANULADA').length}</h3>
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
                {ESTADOS.map((e) => (
                    <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
              <tr>
                <th>N° boleta</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Comuna</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {lista.map((b) => (
                  <tr key={b.numero}>
                    <td className="fw-bold">#{b.numero}</td>
                    <td>{formatearFecha(b.fecha)}</td>
                    <td>
                      {b.clienteNombre}
                      <div className="small text-muted">{b.clienteCorreo}</div>
                    </td>
                    <td>{b.comuna}</td>
                    <td>${b.total.toLocaleString('es-CL')}</td>
                    <td>
                      <span className={'badge ' + buscarEstado(b.estado).color}>{buscarEstado(b.estado).etiqueta}</span>
                    </td>
                    <td>
                      <Link to={'/admin/ordenes/' + b.numero} className="btn btn-outline-primary btn-sm">
                        Ver boleta
                      </Link>
                    </td>
                  </tr>
              ))}
              {!cargando && lista.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No hay boletas con ese filtro</td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

