import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PRODUCTOS, CATEGORIAS } from '../data/datos';
import { useCart } from '../context/CartContext';

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaURL = searchParams.get('categoria') || '';

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState(categoriaURL);
  const [orden, setOrden] = useState('');
  const [notificacion, setNotificacion] = useState(null);

  const { agregarAlCarrito } = useCart();

  // Sincronizar parámetro de URL si cambia externamente
  useEffect(() => {
    if (categoriaURL) {
      setCategoria(categoriaURL);
    }
  }, [categoriaURL]);

  const handleCambioCategoria = (nuevaCat) => {
    setCategoria(nuevaCat);
    if (nuevaCat) {
      setSearchParams({ categoria: nuevaCat });
    } else {
      setSearchParams({});
    }
  };

  // Filtrado y ordenamiento computado
  const productosFiltrados = useMemo(() => {
    return PRODUCTOS.filter((p) => {
      const coincideBusqueda =
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busqueda.toLowerCase());

      const coincideCategoria = categoria ? p.categoria === categoria : true;

      return coincideBusqueda && coincideCategoria;
    }).sort((a, b) => {
      if (orden === 'precio-asc') return a.precio - b.precio;
      if (orden === 'precio-desc') return b.precio - a.precio;
      if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
      return 0;
    });
  }, [busqueda, categoria, orden]);

  const handleAgregar = (producto) => {
    const res = agregarAlCarrito(producto, 1);
    setNotificacion({
      tipo: res.ok ? 'success' : 'danger',
      mensaje: res.mensaje
    });
    setTimeout(() => setNotificacion(null), 3500);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria('');
    setOrden('');
    setSearchParams({});
  };

  return (
    <div className="container my-5">
      {/* Encabezado */}
      <div className="mb-4">
        <h1 className="display-6 fw-bold mb-2">Catálogo de Instrumentos</h1>
        <p className="text-muted">
          Mostrando <strong>{productosFiltrados.length}</strong> de {PRODUCTOS.length} productos disponibles
        </p>
      </div>

      {/* Alerta de feedback */}
      {notificacion && (
        <div className={`alert alert-${notificacion.tipo} alert-dismissible fade show shadow-sm`} role="alert">
          <i className={`bi ${notificacion.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {notificacion.mensaje}
          <button type="button" className="btn-close" onClick={() => setNotificacion(null)}></button>
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="card shadow-sm border-0 bg-white p-3 mb-4 rounded-3">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label className="form-label small fw-semibold text-muted mb-1">
              <i className="bi bi-search me-1"></i> Buscar por nombre, marca o código
            </label>
            <input
              type="search"
              className="form-control"
              placeholder="Ej: Yamaha, Stratocaster, GA001…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <label className="form-label small fw-semibold text-muted mb-1">
              <i className="bi bi-funnel me-1"></i> Categoría
            </label>
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => handleCambioCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label small fw-semibold text-muted mb-1">
              <i className="bi bi-arrow-down-up me-1"></i> Ordenar por
            </label>
            <select
              className="form-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="">Por defecto</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre (A - Z)</option>
            </select>
          </div>
        </div>

        {(busqueda || categoria || orden) && (
          <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
            <span className="small text-muted">
              Filtro activo: {categoria && <span className="badge bg-secondary me-1">{categoria}</span>}
              {busqueda && <span className="badge bg-light text-dark border me-1">"{busqueda}"</span>}
            </span>
            <button className="btn btn-link btn-sm text-danger text-decoration-none p-0" onClick={limpiarFiltros}>
              <i className="bi bi-x-circle me-1"></i>Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Grilla de Productos */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-5 my-4 bg-white rounded-3 shadow-sm border">
          <i className="bi bi-search display-1 text-muted opacity-50 mb-3"></i>
          <h3 className="fw-bold">No se encontraron productos</h3>
          <p className="text-muted">Intenta ajustando el término de búsqueda o la categoría seleccionada.</p>
          <button className="btn btn-amber mt-2" onClick={limpiarFiltros}>
            Ver todo el catálogo
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {productosFiltrados.map((prod) => (
            <div key={prod.codigo} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100 card-producto shadow-sm border">
                <div className="position-relative">
                  <img
                    src={prod.imagen}
                    className="card-img-top img-producto-cover"
                    alt={prod.nombre}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="position-absolute top-0 start-0 m-2 badge bg-tolex opacity-90">
                    {prod.codigo}
                  </span>
                  {prod.stock <= prod.stockCritico && prod.stock > 0 && (
                    <span className="position-absolute top-0 end-0 m-2 badge bg-danger">
                      ¡Últimas {prod.stock}!
                    </span>
                  )}
                  {prod.stock === 0 && (
                    <span className="position-absolute top-0 end-0 m-2 badge bg-secondary">
                      Agotado
                    </span>
                  )}
                </div>

                <div className="card-body d-flex flex-column">
                  <span className="badge bg-light text-secondary border mb-2 align-self-start small">
                    {prod.categoria}
                  </span>
                  <h6 className="card-title fw-bold mb-1 text-truncate" title={prod.nombre}>
                    {prod.nombre}
                  </h6>
                  <p className="text-muted small mb-2">{prod.marca} • {prod.modelo}</p>
                  <p className="text-secondary small mb-3 text-truncate-2" style={{ minHeight: '2.4em' }}>
                    {prod.descripcion}
                  </p>

                  <div className="mt-auto pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-baseline mb-2">
                      <span className="fs-5 fw-bold text-dark">
                        ${prod.precio.toLocaleString('es-CL')}
                      </span>
                      <span className="small text-muted">IVA inc.</span>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-amber btn-sm fw-semibold"
                        disabled={prod.stock === 0}
                        onClick={() => handleAgregar(prod)}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        {prod.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                      </button>
                      <Link
                        to={`/producto/${prod.codigo}`}
                        className="btn btn-outline-secondary btn-sm"
                      >
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