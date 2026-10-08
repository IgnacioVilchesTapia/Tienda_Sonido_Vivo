import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTOS } from '../../data/datos';

export default function AdminProductos() {
  const [productos, setProductos] = useState(PRODUCTOS);
  const [filtro, setFiltro] = useState('');

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    p.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
    p.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleEliminar = (codigo) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto ${codigo}?`)) {
      setProductos(productos.filter((p) => p.codigo !== codigo));
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Mantenedor de Productos</h1>
          <p className="text-muted mb-0">Gestión de catálogo, precios e inventario</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Volver al Dashboard
        </Link>
      </div>

      <div className="card shadow-sm p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por código, nombre o categoría…"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <div className="col-md-4 text-md-end">
            <span className="text-muted small align-middle me-3">{filtrados.length} productos</span>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Marca / Modelo</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.codigo}>
                  <td className="fw-bold">{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.marca} {p.modelo}</td>
                  <td><span className="badge bg-secondary">{p.categoria}</span></td>
                  <td>${p.precio.toLocaleString('es-CL')}</td>
                  <td>
                    <span className={`badge ${p.stock <= p.stockCritico ? 'bg-danger' : 'bg-success'}`}>
                      {p.stock} unid.
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleEliminar(p.codigo)}
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
