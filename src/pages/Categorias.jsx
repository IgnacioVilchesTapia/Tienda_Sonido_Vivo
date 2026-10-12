import { useState } from 'react';
import { obtenerProductos, obtenerCategorias } from '../data/datos';
import { useCart } from '../context/CartContext';
import ProductoLista from '../components/ProductoLista';

export default function Categorias() {
  const [productos] = useState(() => obtenerProductos());
  const [categorias] = useState(() => obtenerCategorias());
  const [seleccionada, setSeleccionada] = useState(categorias[0]);
  const [aviso, setAviso] = useState(null);
  const { agregarAlCarrito } = useCart();

  const productosCategoria = productos.filter((p) => p.categoria === seleccionada);

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
        {categorias.map((cat) => {
          const cantidad = productos.filter((p) => p.categoria === cat).length;
          const primero = productos.find((p) => p.categoria === cat);
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

      <ProductoLista
        productos={productosCategoria}
        onAgregar={agregar}
        mensajeVacio="Esta categoría todavía no tiene productos."
      />
    </div>
  );
}
