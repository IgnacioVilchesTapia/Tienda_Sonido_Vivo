import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTOS, CATEGORIAS } from '../data/datos';
import { useCart } from '../context/CartContext';

export default function Categorias() {
  const [seleccionada, setSeleccionada] = useState(CATEGORIAS[0]);
  const [aviso, setAviso] = useState(null);
  const { agregarAlCarrito } = useCart();

  const productosCategoria = PRODUCTOS.filter((p) => p.categoria === seleccionada);

  const agregar = (p) => {
    const res = agregarAlCarrito(p, 1);
    setAviso(res);
    setTimeout(() => setAviso(null), 3000);
  };

  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-1">Categorías</h1>
      <p className="text-muted mb-4">Elige una categoría para ver sus productos</p>

      <div className="row g-3 mb-5">
        {CATEGORIAS.map((cat) => {
          const cantidad = PRODUCTOS.filter((p) => p.categoria === cat).length;
          const primero = PRODUCTOS.find((p) => p.categoria === cat);
          return (
            <div key={cat} className="col-6 col-md-4 col-lg-3">
              <div
                className={'card h-100 text-center card-producto ' + (seleccionada === cat ? 'border-warning border-2' : '')}
                style={{ cursor: 'pointer' }}
                onClick={() => setSeleccionada(cat)}
              >
                <img
                  src={primero ? primero.imagen : '/img/accesorios.jpg'}
                  className="card-img-top"
                  alt={cat}
                  style={{ height: 110, objectFit: 'cover' }}
                />
                <div className="card-body p-2">
                  <h6 className="fw-bold mb-0">{cat}</h6>
                  <small className="text-muted">{cantidad} productos</small>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="fw-bold mb-3">{seleccionada}</h2>

      {aviso && (
        <div className={'alert ' + (aviso.ok ? 'alert-success' : 'alert-danger')}>{aviso.mensaje}</div>
      )}

      {productosCategoria.length === 0 ? (
        <p className="text-muted">Esta categoría todavía no tiene productos.</p>
      ) : (
        <div className="row g-4">
          {productosCategoria.map((p) => (
            <div key={p.codigo} className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 shadow-sm">
                <img src={p.imagen} className="card-img-top img-producto-cover" alt={p.nombre} />
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold">{p.nombre}</h6>
                  <p className="text-muted small mb-2">{p.marca} {p.modelo}</p>
                  <p className="fw-bold fs-5 mt-auto mb-2">${p.precio.toLocaleString('es-CL')}</p>
                  <div className="d-flex gap-2">
                    <Link to={'/producto/' + p.codigo} className="btn btn-outline-secondary btn-sm w-50">
                      Ver
                    </Link>
                    <button className="btn btn-amber btn-sm w-50" disabled={p.stock === 0} onClick={() => agregar(p)}>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
