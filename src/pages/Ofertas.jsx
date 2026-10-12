import { useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos, OFERTAS } from '../data/datos';
import { useCart } from '../context/CartContext';
export default function Ofertas() {
  const { agregarAlCarrito } = useCart();
     const [mensaje, setMensaje] = useState('');
        const [tipo, setTipo] = useState('success');

  const productos = obtenerProductos();

  const productosOferta = OFERTAS.map((o) => {
    const p = productos.find((prod) => prod.codigo === o.codigo);
    if (!p) return null;
    const precioOferta = Math.round((p.precio - (p.precio * o.descuento) / 100) / 10) * 10;
    return { ...p, descuento: o.descuento, precioOferta: precioOferta };
  }).filter((p) => p !== null);

  const agregar = (p) => {
    const res = agregarAlCarrito({ ...p, precio: p.precioOferta }, 1);
    setTipo(res.ok ? 'success' : 'danger');
    setMensaje(res.mensaje);
    setTimeout(() => setMensaje(''), 3000);
  };
  return (
    <div className="container my-5">
      <div className="bg-tolex text-white rounded-3 p-4 mb-4">
        <h1 className="fw-bold mb-1">Ofertas</h1>
        <p className="mb-0 opacity-75">Productos con descuento hasta agotar stock.</p>
      </div>

      {mensaje !== '' && <div className={'alert alert-' + tipo}>{mensaje}</div>}

      <div className="row g-4">
        {productosOferta.map((p) => (
          <div className="col-12 col-sm-6 col-lg-3" key={p.codigo}>
            <div className="card h-100 shadow-sm">
              <div className="position-relative">
                <img src={p.imagen} className="card-img-top img-producto-cover" alt={p.nombre} />
                <span className="badge bg-danger position-absolute top-0 end-0 m-2 fs-6">-{p.descuento}%</span>
              </div>
              <div className="card-body d-flex flex-column">
                <small className="text-muted">{p.categoria}</small>
                <h6 className="fw-bold">{p.nombre}</h6>
                <div className="mt-auto">
                  <div className="text-muted text-decoration-line-through small">
                    ${p.precio.toLocaleString('es-CL')}
                  </div>
                  <div className="fw-bold fs-5 text-danger">${p.precioOferta.toLocaleString('es-CL')}</div>
                  <button
                    className="btn btn-amber btn-sm w-100 mt-2"
                    disabled={p.stock === 0}
                    onClick={() => agregar(p)}
                  >
                    Agregar al carrito
                  </button>
                  <Link to={'/producto/' + p.codigo} className="btn btn-link btn-sm w-100">
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
