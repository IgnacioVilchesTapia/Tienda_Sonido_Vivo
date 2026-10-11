import { Link, useLocation } from 'react-router-dom';

export default function CompraExitosa() {
  const location = useLocation();
  const orden = location.state ? location.state.orden : null;
  if (!orden) {
    return (
      <div className="container my-5 text-center">
        <h2 className="fw-bold">No hay ninguna compra para mostrar</h2>
        <Link to="/productos" className="btn btn-amber mt-3">Ir al catálogo</Link>
      </div>
    );
  }
  const enviarCorreo = () => {
    alert('La boleta se envió a ' + orden.cliente.correo);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: 820 }}>
        <div className="d-flex flex-wrap justify-content-between gap-2">
          <h3 className="fw-bold text-success">
            <i className="bi bi-check-circle me-2"></i>Se ha realizado la compra. nro #{orden.numero}
          </h3>
          <small className="text-muted">Código orden: ORDER{orden.numero}</small>
        </div>
        <p className="text-muted small">Fecha: {orden.fecha}</p>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label small">Nombre</label>
            <input className="form-control" value={orden.cliente.nombre} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Apellidos</label>
            <input className="form-control" value={orden.cliente.apellidos} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Correo</label>
            <input className="form-control" value={orden.cliente.correo} readOnly />
          </div>
        </div>

        <h6 className="fw-bold">Dirección de entrega de los productos</h6>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label small">Calle</label>
            <input className="form-control" value={orden.direccion.calle} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label small">Departamento</label>
            <input className="form-control" value={orden.direccion.depto} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label small">Región</label>
            <input className="form-control" value={orden.direccion.region} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label small">Comuna</label>
            <input className="form-control" value={orden.direccion.comuna} readOnly />
          </div>
          <div className="col-12">
            <label className="form-label small">Indicaciones para la entrega</label>
            <textarea className="form-control" rows="2" value={orden.direccion.indicaciones} readOnly></textarea>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.items.map((it) => (
                <tr key={it.codigo}>
                  <td><img src={it.imagen} alt={it.nombre} width="45" height="45" className="rounded" style={{ objectFit: 'cover' }} /></td>
                  <td>{it.nombre}</td>
                  <td>${it.precio.toLocaleString('es-CL')}</td>
                  <td>{it.cantidad}</td>
                  <td>${(it.precio * it.cantidad).toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border rounded p-3 text-center fs-5 mb-3">
          Total pagado: <strong>${orden.total.toLocaleString('es-CL')}</strong>
        </div>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <button className="btn btn-danger btn-sm" onClick={() => window.print()}>Imprimir boleta en PDF</button>
          <button className="btn btn-success btn-sm" onClick={enviarCorreo}>Enviar boleta por email</button>
          <Link to="/productos" className="btn btn-outline-dark btn-sm">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
