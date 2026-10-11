import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function PagoError() {
  const location = useLocation();
  const navigate = useNavigate();
  const orden = location.state ? location.state.orden : null;
  if (!orden) {
    return (
      <div className="container my-5 text-center">
        <h2 className="fw-bold">No hay información del pago</h2>
        <Link to="/carrito" className="btn btn-amber mt-3">Volver al carrito</Link>
      </div>
    );
  }

  const reintentar = () => {
    navigate('/checkout', { state: { datos: location.state.datos } });
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: 820 }}>
        <h3 className="fw-bold text-danger">
          <i className="bi bi-x-circle me-2"></i>No se pudo realizar el pago. nro #{orden.numero}
        </h3>
        <p className="text-muted small">El banco rechazó la transacción, no se hizo ningún cargo. Puedes intentarlo de nuevo.</p>

        <div className="text-center mb-4">
          <button className="btn btn-success fw-bold px-4" onClick={reintentar}>
            VOLVER A REALIZAR EL PAGO
          </button>
        </div>

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
          <div className="col-md-6">
            <label className="form-label small">Calle</label>
            <input className="form-control" value={orden.direccion.calle} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label small">Comuna</label>
            <input className="form-control" value={orden.direccion.comuna + ', ' + orden.direccion.region} readOnly />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.items.map((it) => (
                <tr key={it.codigo}>
                  <td>{it.nombre}</td>
                  <td>${it.precio.toLocaleString('es-CL')}</td>
                  <td>{it.cantidad}</td>
                  <td>${(it.precio * it.cantidad).toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border rounded p-3 text-center fs-5">
          Total: <strong>${orden.total.toLocaleString('es-CL')}</strong>
        </div>
      </div>
    </div>
  );
}
