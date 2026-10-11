import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { REGIONES, obtenerComunasPorRegion } from '../data/regiones';
import { validarTexto, validarEmail } from '../utils/validaciones';
import { guardarOrden } from '../data/datos';

const vacio = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  depto: '',
  region: '',
  comuna: '',
  indicaciones: ''
};

export default function Checkout() {
  const { items, subtotal, descuento, costoDespacho, total, vaciarCarrito } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [datos, setDatos] = useState(location.state && location.state.datos ? location.state.datos : vacio);
  const [errores, setErrores] = useState({});

  if (items.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2 className="fw-bold">No tienes productos en el carrito</h2>
        <p className="text-muted">Agrega algo antes de ir a pagar.</p>
        <Link to="/productos" className="btn btn-amber">Ir al catálogo</Link>
      </div>
    );
  }

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const cambiarRegion = (e) => {
    setDatos({ ...datos, region: e.target.value, comuna: '' });
  };

  const pagar = (e) => {
    e.preventDefault();
    const err = {};

    const n = validarTexto(datos.nombre, 2, 50, 'El nombre');
    if (!n.esValido) err.nombre = n.mensaje;
    const a = validarTexto(datos.apellidos, 2, 100, 'Los apellidos');
    if (!a.esValido) err.apellidos = a.mensaje;
    const c = validarEmail(datos.correo);
    if (!c.esValido) err.correo = c.mensaje;
    const ca = validarTexto(datos.calle, 5, 150, 'La calle');
    if (!ca.esValido) err.calle = ca.mensaje;
    if (datos.region === '') err.region = 'Selecciona una región';
    if (datos.comuna === '') err.comuna = 'Selecciona una comuna';

    setErrores(err);
    if (Object.keys(err).length > 0) return;

    const pagoAprobado = Math.random() > 0.3;

    const orden = {
      numero: String(Date.now()).slice(-8),
      fecha: new Date().toLocaleDateString('es-CL'),
      estado: pagoAprobado ? 'Pagada' : 'Rechazada',
      cliente: { nombre: datos.nombre, apellidos: datos.apellidos, correo: datos.correo },
      direccion: {
        calle: datos.calle,
        depto: datos.depto,
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones
      },
      items: items.map((it) => ({
        codigo: it.codigo,
        nombre: it.nombre,
        precio: it.precio,
        cantidad: it.cantidad,
        imagen: it.imagen
      })),
      subtotal: subtotal,
      descuento: descuento,
      despacho: costoDespacho,
      total: total
    };

    guardarOrden(orden);

    if (pagoAprobado) {
      vaciarCarrito();
      navigate('/compra-exitosa', { state: { orden: orden } });
    } else {
      navigate('/pago-error', { state: { orden: orden, datos: datos } });
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: 820 }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 className="fw-bold mb-0">Carrito de compra</h3>
            <small className="text-muted">Revisa tus productos y completa tus datos</small>
          </div>
          <span className="btn btn-primary disabled opacity-100">
            Total a pagar: <strong>${total.toLocaleString('es-CL')}</strong>
          </span>
        </div>

        <div className="table-responsive mb-4">
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
              {items.map((it) => (
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

        <form onSubmit={pagar} noValidate>
          <h5 className="fw-bold">Información del cliente</h5>
          <p className="small text-muted">Completa la siguiente información</p>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label small">Nombre*</label>
              <input name="nombre" className={'form-control ' + (errores.nombre ? 'is-invalid' : '')} value={datos.nombre} onChange={cambiar} />
              <div className="invalid-feedback">{errores.nombre}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label small">Apellidos*</label>
              <input name="apellidos" className={'form-control ' + (errores.apellidos ? 'is-invalid' : '')} value={datos.apellidos} onChange={cambiar} />
              <div className="invalid-feedback">{errores.apellidos}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label small">Correo*</label>
              <input name="correo" type="email" className={'form-control ' + (errores.correo ? 'is-invalid' : '')} value={datos.correo} onChange={cambiar} />
              <div className="invalid-feedback">{errores.correo}</div>
            </div>
          </div>

          <h5 className="fw-bold">Dirección de entrega de los productos</h5>
          <p className="small text-muted">Ingrese dirección de forma detallada</p>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small">Calle*</label>
              <input name="calle" className={'form-control ' + (errores.calle ? 'is-invalid' : '')} value={datos.calle} onChange={cambiar} />
              <div className="invalid-feedback">{errores.calle}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label small">Departamento (opcional)</label>
              <input name="depto" className="form-control" placeholder="Ej: 603" value={datos.depto} onChange={cambiar} />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Región*</label>
              <select name="region" className={'form-select ' + (errores.region ? 'is-invalid' : '')} value={datos.region} onChange={cambiarRegion}>
                <option value="">Selecciona una región</option>
                {REGIONES.map((r) => (
                  <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                ))}
              </select>
              <div className="invalid-feedback">{errores.region}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label small">Comuna*</label>
              <select name="comuna" className={'form-select ' + (errores.comuna ? 'is-invalid' : '')} value={datos.comuna} onChange={cambiar} disabled={datos.region === ''}>
                <option value="">Selecciona una comuna</option>
                {obtenerComunasPorRegion(datos.region).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="invalid-feedback">{errores.comuna}</div>
            </div>
            <div className="col-12">
              <label className="form-label small">Indicaciones para la entrega (opcional)</label>
              <textarea
                name="indicaciones"
                className="form-control"
                rows="3"
                placeholder="Ej: entre calles, color del edificio, no tiene timbre."
                value={datos.indicaciones}
                onChange={cambiar}
              ></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <Link to="/carrito" className="btn btn-outline-secondary">Volver al carrito</Link>
            <button type="submit" className="btn btn-success fw-bold">
              Pagar ahora ${total.toLocaleString('es-CL')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
