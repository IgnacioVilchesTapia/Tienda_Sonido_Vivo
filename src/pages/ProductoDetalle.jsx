import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerProductoPorCodigo, obtenerProductosRelacionados } from '../data/datos';
import { useCart } from '../context/CartContext';

export default function ProductoDetalle() {
  const { codigo } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [relacionados, setRelacionados] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    const encontrado = obtenerProductoPorCodigo(codigo);
    setProducto(encontrado);
    setCantidad(1);
    setFeedback(null);

    if (encontrado) {
      const rels = obtenerProductosRelacionados(encontrado.categoria, encontrado.codigo, 4);
      setRelacionados(rels);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [codigo]);

  const handleAgregar = () => {
    if (!producto) return;
    const res = agregarAlCarrito(producto, cantidad);
    setFeedback({
      tipo: res.ok ? 'success' : 'danger',
      mensaje: res.mensaje
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  if (!producto) {
    return (
      <div className="container py-5 my-5 text-center">
        <i className="bi bi-search display-1 text-muted mb-3"></i>
        <h2 className="fw-bold">Producto no encontrado</h2>
        <p className="text-muted">No encontramos ningún instrumento registrado con el código <code>{codigo}</code>.</p>
        <Link className="btn btn-amber mt-3 px-4" to="/productos">
          <i className="bi bi-arrow-left me-1"></i> Volver al Catálogo
        </Link>
      </div>
    );
  }

  const esCritico = producto.stock <= producto.stockCritico && producto.stock > 0;
  const sinStock = producto.stock === 0;

  return (
    <div className="container my-5">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos" className="text-decoration-none">Catálogo</Link></li>
          <li className="breadcrumb-item"><Link to={`/productos?categoria=${encodeURIComponent(producto.categoria)}`} className="text-decoration-none">{producto.categoria}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      {/* Alerta de Feedback */}
      {feedback && (
        <div className={`alert alert-${feedback.tipo} alert-dismissible fade show shadow-sm mb-4`} role="alert">
          <i className={`bi ${feedback.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {feedback.mensaje}
          <Link to="/carrito" className="btn btn-sm btn-outline-dark ms-3">
            Ir al Carrito <i className="bi bi-arrow-right"></i>
          </Link>
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      {/* Ficha Principal */}
      <div className="card shadow-sm border-0 p-4 mb-5 rounded-3">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6 text-center">
            <div className="p-3 bg-light rounded-3 border">
              <img
                src={producto.imagen}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '420px', objectFit: 'contain' }}
                alt={producto.nombre}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-secondary">{producto.categoria}</span>
              <span className="badge bg-light text-dark border">Código: {producto.codigo}</span>
            </div>

            <h1 className="h2 fw-bold mb-1">{producto.nombre}</h1>
            <p className="text-muted fs-5 mb-3">{producto.marca} • Modelo {producto.modelo}</p>

            <div className="bg-light p-3 rounded-3 mb-3 d-flex align-items-baseline gap-2">
              <span className="display-6 fw-bold text-dark">
                ${producto.precio.toLocaleString('es-CL')}
              </span>
              <span className="text-muted small">IVA incluido</span>
            </div>

            {/* Disponibilidad / Stock */}
            <div className="mb-3">
              {sinStock ? (
                <span className="badge bg-secondary px-3 py-2 fs-6">Agotado temporalmente</span>
              ) : esCritico ? (
                <span className="badge bg-danger px-3 py-2 fs-6">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  ¡Stock crítico! Solo quedan {producto.stock} unidades
                </span>
              ) : (
                <span className="badge bg-success px-3 py-2 fs-6">
                  <i className="bi bi-check-circle me-1"></i>
                  Disponible en tienda ({producto.stock} unidades)
                </span>
              )}
            </div>

            <p className="text-secondary leading-relaxed mb-4">
              {producto.descripcion}
            </p>

            {/* Selector de cantidad y botón */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="d-flex align-items-center border rounded bg-white">
                <button
                  type="button"
                  className="btn btn-sm btn-link text-dark px-3 text-decoration-none"
                  disabled={cantidad <= 1 || sinStock}
                  onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <span className="px-3 fw-bold">{cantidad}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-dark px-3 text-decoration-none"
                  disabled={cantidad >= producto.stock || sinStock}
                  onClick={() => setCantidad((prev) => Math.min(producto.stock, prev + 1))}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>

              <button
                className="btn btn-amber btn-lg px-4 flex-grow-1 fw-bold shadow-sm"
                disabled={sinStock}
                onClick={handleAgregar}
              >
                <i className="bi bi-cart-plus me-2"></i>
                {sinStock ? 'Sin Stock' : 'Añadir al Carrito'}
              </button>
            </div>

            {/* Beneficios de compra */}
            <div className="border-top pt-3 small text-muted">
              <div className="row g-2">
                <div className="col-sm-6">
                  <i className="bi bi-shield-check text-success me-2"></i>Garantía oficial de 6 meses
                </div>
                <div className="col-sm-6">
                  <i className="bi bi-truck text-primary me-2"></i>Envío gratis si tu orden supera $150.000
                </div>
                <div className="col-sm-6">
                  <i className="bi bi-geo-alt text-danger me-2"></i>Retiro inmediato en Viña del Mar
                </div>
                <div className="col-sm-6">
                  <i className="bi bi-patch-check text-warning me-2"></i>Calibración y revisión técnica
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h4 fw-bold mb-0">Instrumentos Relacionados</h3>
            <Link to={`/productos?categoria=${encodeURIComponent(producto.categoria)}`} className="btn btn-outline-dark btn-sm">
              Ver más de {producto.categoria}
            </Link>
          </div>

          <div className="row g-3">
            {relacionados.map((rel) => (
              <div key={rel.codigo} className="col-6 col-md-3">
                <div className="card h-100 card-producto border shadow-sm">
                  <img
                    src={rel.imagen}
                    className="card-img-top img-producto-cover"
                    alt={rel.nombre}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold small mb-1 text-truncate" title={rel.nombre}>
                      {rel.nombre}
                    </h6>
                    <p className="text-muted small mb-2">{rel.marca}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-dark small">${rel.precio.toLocaleString('es-CL')}</span>
                      <Link to={`/producto/${rel.codigo}`} className="btn btn-sm btn-outline-primary py-0 px-2">
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}