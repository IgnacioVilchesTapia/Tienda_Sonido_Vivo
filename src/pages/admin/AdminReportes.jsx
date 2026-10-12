import { Link } from 'react-router-dom';
import { obtenerProductos, obtenerCategorias, obtenerOrdenes } from '../../data/datos';
export default function AdminReportes() {
  const productos = obtenerProductos();
  const pagadas = obtenerOrdenes().filter((o) => o.estado === 'Pagada');

  let totalVentas = 0;
  pagadas.forEach((o) => {
    totalVentas += o.total;
  });
  const promedio = pagadas.length > 0 ? Math.round(totalVentas / pagadas.length) : 0;
  const ventasCategoria = {};
  const vendidos = {};
  pagadas.forEach((o) => {
    o.items.forEach((it) => {
      const prod = productos.find((p) => p.codigo === it.codigo);
      const cat = prod ? prod.categoria : 'Otros';
      ventasCategoria[cat] = (ventasCategoria[cat] || 0) + it.precio * it.cantidad;
      vendidos[it.nombre] = (vendidos[it.nombre] || 0) + it.cantidad;
    });
  });

  const maxCategoria = Math.max(1, ...Object.values(ventasCategoria));

  const topProductos = Object.keys(vendidos)
    .map((nombre) => ({ nombre: nombre, cantidad: vendidos[nombre] }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  const inventario = obtenerCategorias().map((cat) => {
    const prods = productos.filter((p) => p.categoria === cat);
    let unidades = 0;
    let valor = 0;
    prods.forEach((p) => {
      unidades += p.stock;
      valor += p.stock * p.precio;
    });
    return { cat: cat, productos: prods.length, unidades: unidades, valor: valor };
  });

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Reportes</h1>
          <p className="text-muted mb-0">Resumen de ventas e inventario</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Dashboard
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="card p-3 shadow-sm border-0 bg-primary text-white">
            <small>Ventas totales</small>
            <h3 className="fw-bold mb-0">${totalVentas.toLocaleString('es-CL')}</h3>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card p-3 shadow-sm border-0 bg-success text-white">
            <small>Compras pagadas</small>
            <h3 className="fw-bold mb-0">{pagadas.length}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card p-3 shadow-sm border-0 bg-warning">
            <small>Ticket promedio</small>
            <h3 className="fw-bold mb-0">${promedio.toLocaleString('es-CL')}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h5 className="fw-bold mb-3">Ventas por categoría</h5>
            {Object.keys(ventasCategoria).length === 0 && <p className="text-muted">Todavía no hay ventas.</p>}
            {Object.keys(ventasCategoria).map((cat) => (
              <div key={cat} className="mb-2">
                <div className="d-flex justify-content-between small">
                  <span>{cat}</span>
                  <span>${ventasCategoria[cat].toLocaleString('es-CL')}</span>
                </div>
                <div className="progress" style={{ height: 10 }}>
                  <div className="progress-bar bg-warning" style={{ width: (ventasCategoria[cat] / maxCategoria) * 100 + '%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h5 className="fw-bold mb-3">Productos más vendidos</h5>
            <ol className="mb-0">
              {topProductos.map((p) => (
                <li key={p.nombre} className="mb-1">
                  {p.nombre} <span className="text-muted small">({p.cantidad} unid.)</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white fw-bold">Inventario por categoría</div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Categoría</th>
                <th>Productos</th>
                <th>Unidades</th>
                <th>Valor en bodega</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((fila) => (
                <tr key={fila.cat}>
                  <td>{fila.cat}</td>
                  <td>{fila.productos}</td>
                  <td>{fila.unidades}</td>
                  <td>${fila.valor.toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
