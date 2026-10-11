import { useParams, Link } from 'react-router-dom';
import { obtenerOrdenes } from '../../data/datos';

export default function AdminBoleta() {
  const { numero } = useParams();
  const orden = obtenerOrdenes().find((o) => o.numero === numero);
  if (!orden) {
    return (
      <div className="container my-5 text-center">
        <h2 className="fw-bold">No existe la orden #{numero}</h2>
        <Link to="/admin/ordenes" className="btn btn-amber mt-3">Volver a órdenes</Link>
      </div>
    );
  }
  const neto = Math.round(orden.total / 1.19);
  const iva = orden.total - neto;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/admin/ordenes" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Volver
        </Link>
        <button className="btn btn-dark btn-sm" onClick={() => window.print()}>
          <i className="bi bi-printer me-1"></i> Imprimir
        </button>
      </div>

      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: 760 }}>
        <div className="d-flex flex-wrap justify-content-between border-bottom pb-3 mb-3">
          <div>
            <h4 className="fw-bold mb-0">Sonido Vivo</h4>
            <small className="text-muted">Av. San Martín 452, Viña del Mar</small>
          </div>
          <div className="text-end">
            <div className="border border-danger text-danger fw-bold px-3 py-1">
              BOLETA N° {orden.numero}
            </div>
            <small className="text-muted">Fecha: {orden.fecha}</small>
          </div>
        </div>

        {orden.estado !== 'Pagada' && (
          <div className="alert alert-danger py-2">Esta orden tiene el pago rechazado, la boleta no es válida.</div>
        )}

        <div className="row mb-3 small">
          <div className="col-md-6">
            <strong>Cliente:</strong> {orden.cliente.nombre} {orden.cliente.apellidos}<br />
            <strong>Correo:</strong> {orden.cliente.correo}
          </div>
          <div className="col-md-6">
            <strong>Despacho:</strong> {orden.direccion.calle} {orden.direccion.depto && 'depto ' + orden.direccion.depto}<br />
            {orden.direccion.comuna}, {orden.direccion.region}
            {orden.direccion.indicaciones && <div className="text-muted">Obs: {orden.direccion.indicaciones}</div>}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-sm">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th className="text-end">Precio</th>
                <th className="text-center">Cant.</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.items.map((it) => (
                <tr key={it.codigo}>
                  <td>{it.codigo}</td>
                  <td>{it.nombre}</td>
                  <td className="text-end">${it.precio.toLocaleString('es-CL')}</td>
                  <td className="text-center">{it.cantidad}</td>
                  <td className="text-end">${(it.precio * it.cantidad).toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ms-auto" style={{ width: 280, maxWidth: "100%" }}>
          <div className="d-flex justify-content-between"><span>Subtotal</span><span>${orden.subtotal.toLocaleString('es-CL')}</span></div>
          {orden.descuento > 0 && (
            <div className="d-flex justify-content-between text-success"><span>Descuento</span><span>-${orden.descuento.toLocaleString('es-CL')}</span></div>
          )}
          <div className="d-flex justify-content-between"><span>Despacho</span><span>${orden.despacho.toLocaleString('es-CL')}</span></div>
          <hr className="my-2" />
          <div className="d-flex justify-content-between small text-muted"><span>Neto</span><span>${neto.toLocaleString('es-CL')}</span></div>
          <div className="d-flex justify-content-between small text-muted"><span>IVA 19%</span><span>${iva.toLocaleString('es-CL')}</span></div>
          <div className="d-flex justify-content-between fw-bold fs-5 mt-1"><span>Total</span><span>${orden.total.toLocaleString('es-CL')}</span></div>
        </div>
      </div>
    </div>
  );
}
