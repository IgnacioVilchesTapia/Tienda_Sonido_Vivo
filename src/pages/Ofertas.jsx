import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarOfertas } from '../services/productoService';
import { obtenerProductos, OFERTAS } from '../data/datos';
import { useCart } from '../context/CartContext';

export default function Ofertas() {
  const { agregarAlCarrito } = useCart();
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('success');

  useEffect(() => {
    listarOfertas()
      .then((datos) => {
        if (datos && datos.length > 0) {
          const formateados = datos.map((p) => {
            const desc = p.descuento || 10;
            const precioOferta = Math.round((p.precio - (p.precio * desc) / 100) / 10) * 10;
            return { ...p, descuento: desc, precioOferta };
          });
          setOfertas(formateados);
        } else {
          cargarLocales();
        }
      })
      .catch(() => {
        cargarLocales();
      })
      .finally(() => setCargando(false));

    function cargarLocales() {
      const prods = obtenerProductos();
      const fallbacks = OFERTAS.map((o) => {
        const p = prods.find((item) => item.codigo === o.codigo);
        if (!p) return null;
        const precioOferta = Math.round((p.precio - (p.precio * o.descuento) / 100) / 10) * 10;
        return { ...p, descuento: o.descuento, precioOferta };
      }).filter(Boolean);
      setOfertas(fallbacks);
    }
  }, []);

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
        <p className="mb-0 opacity-75">Productos con descuento especial hasta agotar stock.</p>
      </div>

      {mensaje && (
        <div className={`alert alert-${tipo} py-2 mb-4`}>
          {mensaje}
        </div>
      )}

      {cargando ? (
        <div className="text-center py-5 text-muted">Cargando ofertas...</div>
      ) : ofertas.length === 0 ? (
        <div className="alert alert-info">No hay ofertas disponibles en este momento.</div>
      ) : (
        <div className="row g-4">
          {ofertas.map((prod) => (
            <div key={prod.codigo} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card h-100 card-producto border shadow-sm">
                <div className="position-relative">
                  <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                    -{prod.descuento}% OFF
                  </span>
                  <img
                    src={prod.imagen}
                    className="card-img-top img-producto-cover"
                    alt={prod.nombre}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-light text-secondary border mb-2 align-self-start">
                    {prod.categoria}
                  </span>
                  <h6 className="card-title fw-bold mb-1">{prod.nombre}</h6>
                  <p className="text-muted small mb-2">{prod.marca} {prod.modelo}</p>
                  <div className="mt-auto pt-2 border-top">
                    <div className="d-flex justify-content-between align-items-baseline mb-2">
                      <span className="text-decoration-line-through text-muted small">
                        ${prod.precio.toLocaleString('es-CL')}
                      </span>
                      <span className="fw-bold text-danger fs-5">
                        ${prod.precioOferta.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-amber btn-sm fw-bold"
                        onClick={() => agregar(prod)}
                        disabled={prod.stock === 0}
                      >
                        {prod.stock === 0 ? 'Agotado' : 'Añadir al carrito'}
                      </button>
                      <Link to={`/producto/${prod.codigo}`} className="btn btn-outline-secondary btn-sm">
                        Ver Detalle
                      </Link>
                    </div>
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
