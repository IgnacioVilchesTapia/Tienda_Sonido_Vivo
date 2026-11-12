import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SoloRol from '../../components/SoloRol';
import { obtenerBoleta, cambiarEstadoBoleta, anularBoleta, ESTADOS, buscarEstado, formatearFecha } from '../../services/boletaService';
import { mensajeDeError } from '../../services/api';

export default function AdminBoleta() {
  const { numero } = useParams();
  const [boleta, setBoleta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');

  useEffect(() => {
    obtenerBoleta(numero)
        .then((datos) => {
          setBoleta(datos);
          setNuevoEstado(datos.estado);
        })
        .catch((err) => setError(mensajeDeError(err)))
        .finally(() => setCargando(false));
  }, [numero]);

  const guardarEstado = async () => {
    setError('');
    try {
      const actualizada = await cambiarEstadoBoleta(boleta.numero, nuevoEstado);
      setBoleta(actualizada);
      setMensaje('Estado cambiado a ' + buscarEstado(actualizada.estado).etiqueta);
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  const anular = async () => {
    if (!window.confirm('¿Anular la boleta N° ' + boleta.numero + '? Se devolverá el stock de sus productos.')) return;
    setError('');
    try {
      const anulada = await anularBoleta(boleta.numero);
      setBoleta(anulada);
      setNuevoEstado(anulada.estado);
      setMensaje('Boleta anulada y stock devuelto');
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  if (cargando) {
    return <div className="container my-5 text-center text-muted">Cargando boleta...</div>;
  }

  if (!boleta) {
    return (
        <div className="container my-5 text-center">
          <h2 className="fw-bold">No existe la boleta #{numero}</h2>
          <p className="text-muted">{error}</p>
          <Link to="/admin/ordenes" className="btn btn-amber mt-3">Volver a órdenes</Link>
        </div>
    );
  }

  const neto = Math.round(boleta.total / 1.19);
  const iva = boleta.total - neto;

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

        {mensaje && <div className="alert alert-success mx-auto" style={{ maxWidth: 760 }}>{mensaje}</div>}
        {error && <div className="alert alert-danger mx-auto" style={{ maxWidth: 760 }}>{error}</div>}

        <SoloRol roles={['ADMIN']}>
          <div className="card shadow-sm p-3 mx-auto mb-3" style={{ maxWidth: 760 }}>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="fw-semibold">Estado:</span>
              <select
                  className="form-select form-select-sm"
                  style={{ width: 180 }}
                  value={nuevoEstado}
                  disabled={boleta.estado === 'ANULADA'}
                  onChange={(e) => setNuevoEstado(e.target.value)}
              >
                {ESTADOS.filter((e) => e.valor !== 'ANULADA').map((e) => (
                    <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
                ))}
              </select>
              <button className="btn btn-amber btn-sm" disabled={boleta.estado === 'ANULADA'} onClick={guardarEstado}>
                Guardar estado
              </button>
              <button className="btn btn-outline-danger btn-sm ms-auto" disabled={boleta.estado === 'ANULADA'} onClick={anular}>
                Anular boleta
              </button>
            </div>
          </div>
        </SoloRol>

        <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: 760 }}>
          <div className="d-flex flex-wrap justify-content-between border-bottom pb-3 mb-3">
            <div>
              <h4 className="fw-bold mb-0">Sonido Vivo</h4>
              <small className="text-muted">Av. San Martín 452, Viña del Mar</small>
            </div>
            <div className="text-end">
              <div className="border border-danger text-danger fw-bold px-3 py-1">
                BOLETA N° {boleta.numero}
              </div>
              <small className="text-muted">Fecha: {formatearFecha(boleta.fecha)}</small>
              <div><span className={'badge ' + buscarEstado(boleta.estado).color}>{buscarEstado(boleta.estado).etiqueta}</span></div>
            </div>
          </div>

          {boleta.estado === 'ANULADA' && (
              <div className="alert alert-danger py-2">Esta boleta está anulada y su stock fue devuelto.</div>
          )}

          <div className="row mb-3 small">
            <div className="col-md-6">
              <strong>Cliente:</strong> {boleta.clienteNombre}<br />
              <strong>RUN:</strong> {boleta.clienteRun}<br />
              <strong>Correo:</strong> {boleta.clienteCorreo}
            </div>
            <div className="col-md-6">
              <strong>Despacho:</strong> {boleta.calle} {boleta.depto && 'depto ' + boleta.depto}<br />
              {boleta.comuna}, {boleta.region}
              {boleta.indicaciones && <div className="text-muted">Obs: {boleta.indicaciones}</div>}
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
              {boleta.detalles.map((d) => (
                  <tr key={d.codigo}>
                    <td>{d.codigo}</td>
                    <td>{d.nombre}</td>
                    <td className="text-end">${d.precioUnitario.toLocaleString('es-CL')}</td>
                    <td className="text-center">{d.cantidad}</td>
                    <td className="text-end">${d.subtotal.toLocaleString('es-CL')}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          <div className="ms-auto" style={{ width: 280, maxWidth: '100%' }}>
            <div className="d-flex justify-content-between"><span>Subtotal</span><span>${boleta.subtotal.toLocaleString('es-CL')}</span></div>
            {boleta.descuento > 0 && (
                <div className="d-flex justify-content-between text-success"><span>Cupón {boleta.cupon}</span><span>-${boleta.descuento.toLocaleString('es-CL')}</span></div>
            )}
            <div className="d-flex justify-content-between"><span>Despacho</span><span>${boleta.despacho.toLocaleString('es-CL')}</span></div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between small text-muted"><span>Neto</span><span>${neto.toLocaleString('es-CL')}</span></div>
            <div className="d-flex justify-content-between small text-muted"><span>IVA 19%</span><span>${iva.toLocaleString('es-CL')}</span></div>
            <div className="d-flex justify-content-between fw-bold fs-5 mt-1"><span>Total</span><span>${boleta.total.toLocaleString('es-CL')}</span></div>
          </div>
        </div>
      </div>
  );
}

