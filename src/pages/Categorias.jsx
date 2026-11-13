import { useState, useMemo } from 'react';
import { useCatalogo } from '../hooks/useCatalogo';
import { useCart } from '../context/CartContext';
import ProductoLista from '../components/ProductoLista';

export default function Categorias() {
  const { productos, categorias, cargando } = useCatalogo();
  const [seleccionada, setSeleccionada] = useState('');
  const [aviso, setAviso] = useState(null);
  const { agregarAlCarrito } = useCart();

  const listaCategorias = useMemo(() => {
    return categorias.map((c) => (typeof c === 'string' ? c : c.nombre));
  }, [categorias]);

  const catActual = seleccionada || listaCategorias[0] || '';

  const productosCategoria = useMemo(() => {
    return productos.filter((p) => p.categoria === catActual);
  }, [productos, catActual]);

  const agregar = (p) => {
    const res = agregarAlCarrito(p, 1);
    setAviso(res);
    setTimeout(() => setAviso(null), 3000);
  };

  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-1">Categorías</h1>
      <p className="text-muted mb-4">Elige una categoría para ver sus productos</p>

      {cargando ? (
        <div className="text-center py-5 text-muted">Cargando categorías...</div>
      ) : (
        <>
          <div className="row g-3 mb-5">
            {listaCategorias.map((cat) => {
              const cantidad = productos.filter((p) => p.categoria === cat).length;
              const primero = productos.find((p) => p.categoria === cat);
              const esActiva = cat === catActual;
              return (
                <div key={cat} className="col-md-4 col-sm-6">
                  <div
                    onClick={() => setSeleccionada(cat)}
                    className={`card h-100 p-3 cursor-pointer border ${
                      esActiva ? 'border-amber shadow' : 'border-light-subtle'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      {primero && (
                        <img
                          src={primero.imagen}
                          alt={cat}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          className="rounded"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      )}
                      <div>
                        <h6 className="fw-bold mb-1">{cat}</h6>
                        <span className="badge bg-secondary">{cantidad} productos</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-4">
            <h3 className="fw-bold">{catActual}</h3>
            <p className="text-muted small">Mostrando {productosCategoria.length} instrumentos disponibles</p>
          </div>

          {aviso && (
            <div className={`alert alert-${aviso.ok ? 'success' : 'danger'} py-2 mb-4`}>
              {aviso.mensaje}
            </div>
          )}

          <ProductoLista productos={productosCategoria} onAgregar={agregar} />
        </>
      )}
    </div>
  );
}
