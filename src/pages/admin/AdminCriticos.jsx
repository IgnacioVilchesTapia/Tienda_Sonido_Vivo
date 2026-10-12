import { Link } from 'react-router-dom';
import { obtenerProductos } from '../../data/datos';

export default function AdminCriticos() {
  const criticos = obtenerProductos().filter((p) => p.stock <= p.stockCritico).sort((a, b) => a.stock - b.stock);
  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Productos críticos</h1>
          <p className="text-muted mb-0">Productos con stock igual o menor a su stock crítico</p>
        </div>
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver a productos</Link>
      </div>

      {criticos.length === 0 ? (
        <div className="alert alert-success">No hay productos en stock crítico.</div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-danger">
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Crítico</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {criticos.map((p) => (
                  <tr key={p.codigo}>
                    <td className="fw-bold">{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td className={p.stock === 0 ? 'text-danger fw-bold' : 'fw-bold'}>{p.stock}</td>
                    <td>{p.stockCritico}</td>
                    <td>
                      <Link to={'/admin/productos/' + p.codigo} className="btn btn-sm btn-outline-primary">
                        Editar stock
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer bg-white small text-muted">{criticos.length} productos para reponer</div>
        </div>
      )}
    </div>
  );
}
