import { Link, useLocation } from 'react-router-dom';
import { formatearFecha } from '../services/boletaService';

export default function CompraExitosa() {
  const location = useLocation();
  const boleta = location.state ? location.state.boleta : null;
  if (!boleta) {
    return (
        <div className="container my-5 text-center">
          <h2 className="fw-bold">No hay ninguna compra para mostrar</h2>
          <Link to="/productos" className="btn btn-amber mt-3">Ir al catálogo</Link>
        </div>
    );
  }
  const enviarCorreo = () => {
    alert('La boleta se envió a ' + boleta.clienteCorreo);
  };

  return (
      <div className="container my-5">
        <div className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: 820 }}>
          <div className="d-flex flex-wrap justify-content-between gap-2">
            <h3 className="fw-bold text-success">
              <i className="bi bi-check-circle me-2"></i>Se ha realizado la compra. Boleta N° {boleta.numero}
            </h3>
            <small className="text-muted">Estado: {boleta.estado}</small>
          </div>
          <p className="text-muted small">Fecha: {formatearFecha(boleta.fecha)}</p>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small">Cliente</label>
              <input className="form-control" value={boleta.clienteNombre} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Correo</label>
              <input className="form-control" value={boleta.clienteCorreo} readOnly />
            </div>
          </div>

          <h6 className="fw-bold">Dirección de entrega de los productos</h6>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small">Calle</label>
              <input className="form-control" value={boleta.calle} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Departamento</label>
              <input className="form-control" value={boleta.depto || ''} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Región</label>
              <input className="form-control" value={boleta.region} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Comuna</label>
              <input className="form-control" value={boleta.comuna} readOnly />
            </div>
            <div className="col-12">
              <label className="form-label small">Indicaciones para la entrega</label>
              <textarea className="form-control" rows="2" value={boleta.indicaciones || ''} readOnly></textarea>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
              </thead>
              <tbody>
              {boleta.detalles.map((d) => (
                  <tr key={d.codigo}>
                    <td>{d.codigo}</td>
                    <td>{d.nombre}</td>
                    <td>${d.precioUnitario.toLocaleString('es-CL')}</td>
                    <td>{d.cantidad}</td>
                    <td>${d.subtotal.toLocaleString('es-CL')}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          <div className="ms-auto mb-3" style={{ width: 280, maxWidth: '100%' }}>
            <div className="d-flex justify-content-between"><span>Subtotal</span><span>${boleta.subtotal.toLocaleString('es-CL')}</span></div>
            {boleta.descuento > 0 && (
                <div className="d-flex justify-content-between text-success">
                  <span>Cupón {boleta.cupon}</span><span>-${boleta.descuento.toLocaleString('es-CL')}</span>
                </div>
            )}
            <div className="d-flex justify-content-between">
              <span>Despacho</span><span>{boleta.despacho === 0 ? 'Gratis' : '$' + boleta.despacho.toLocaleString('es-CL')}</span>
            </div>
          </div>

          <div className="border rounded p-3 text-center fs-5 mb-3">
            Total pagado: <strong>${boleta.total.toLocaleString('es-CL')}</strong>
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

