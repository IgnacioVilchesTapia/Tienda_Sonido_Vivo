import { Link } from 'react-router-dom';
import { PRODUCTOS, CATEGORIAS, BLOGS } from '../data/datos';

export default function Home() {
  const destacados = PRODUCTOS.slice(0, 4);

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-tolex text-white py-5 position-relative overflow-hidden">
        <div className="container py-lg-4">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark px-3 py-2 fw-semibold text-uppercase mb-3">
                <i className="bi bi-geo-alt-fill me-1"></i> Viña del Mar — Desde 2014
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Tu pasión por la música, <span className="text-amber">en Sonido Vivo</span>
              </h1>
              <p className="lead text-light opacity-75 mb-4">
                Instrumentos musicales seleccionados, equipamiento de audio profesional y asesoría técnica real. Envíos garantizados a todo Chile.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/productos" className="btn btn-amber btn-lg px-4 shadow">
                  <i className="bi bi-grid me-2"></i>Ver Catálogo
                </Link>
                <Link to="/nosotros" className="btn btn-outline-light btn-lg px-4">
                  Conoce Nuestra Tienda
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <div className="card bg-tolex-dark border border-secondary border-opacity-25 p-4 rounded-4 shadow-lg">
                <i className="bi bi-music-player text-amber display-1 mb-3"></i>
                <h3 className="text-white mb-2">Más de 50 instrumentos</h3>
                <p className="text-secondary small mb-3">Guitarras, bajos, teclados, percusión y accesorios de las mejores marcas mundiales.</p>
                <div className="row g-2 text-start">
                  <div className="col-6"><span className="text-light small"><i className="bi bi-check2 text-amber me-1"></i> Garantía 6 meses</span></div>
                  <div className="col-6"><span className="text-light small"><i className="bi bi-check2 text-amber me-1"></i> Servicio técnico</span></div>
                  <div className="col-6"><span className="text-light small"><i className="bi bi-check2 text-amber me-1"></i> Calibración gratis</span></div>
                  <div className="col-6"><span className="text-light small"><i className="bi bi-check2 text-amber me-1"></i> Despacho express</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franja de Beneficios */}
      <section className="py-4 bg-white border-bottom shadow-sm">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <i className="bi bi-truck text-amber fs-2 mb-2"></i>
              <h6 className="fw-bold mb-1">Envío a Todo Chile</h6>
              <p className="text-muted small mb-0">Gratis sobre $150.000</p>
            </div>
            <div className="col-md-3 col-6">
              <i className="bi bi-shield-check text-amber fs-2 mb-2"></i>
              <h6 className="fw-bold mb-1">Compra Protegida</h6>
              <p className="text-muted small mb-0">Instrumentos revisados</p>
            </div>
            <div className="col-md-3 col-6">
              <i className="bi bi-tools text-amber fs-2 mb-2"></i>
              <h6 className="fw-bold mb-1">Taller de Luthier</h6>
              <p className="text-muted small mb-0">Calibración en Viña del Mar</p>
            </div>
            <div className="col-md-3 col-6">
              <i className="bi bi-headset text-amber fs-2 mb-2"></i>
              <h6 className="fw-bold mb-1">Asesoría de Músicos</h6>
              <p className="text-muted small mb-0">Atención personalizada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-amber fw-bold text-uppercase small">Nuestra Selección</span>
              <h2 className="fw-bold mb-0">Instrumentos Destacados</h2>
            </div>
            <Link to="/productos" className="btn btn-outline-dark btn-sm">
              Ver todos <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-4">
            {destacados.map((prod) => (
              <div key={prod.codigo} className="col-md-3 col-sm-6">
                <div className="card h-100 card-producto border shadow-sm">
                  <img
                    src={prod.imagen}
                    className="card-img-top img-producto-cover"
                    alt={prod.nombre}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'; }}
                  />
                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-light text-secondary border mb-2 align-self-start">{prod.categoria}</span>
                    <h6 className="card-title fw-bold mb-1">{prod.nombre}</h6>
                    <p className="text-muted small mb-2">{prod.marca} {prod.modelo}</p>
                    <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-primary fs-5">${prod.precio.toLocaleString('es-CL')}</span>
                      <Link to={`/producto/${prod.codigo}`} className="btn btn-sm btn-outline-primary">
                        Ver Ficha
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías Principales */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Explora por Categoría</h2>
            <p className="text-muted">Encuentra exactamente lo que necesitas para tu sonido</p>
          </div>
          <div className="row g-3 justify-content-center">
            {CATEGORIAS.slice(0, 6).map((cat) => (
              <div key={cat} className="col-md-4 col-sm-6">
                <Link
                  to={`/productos?categoria=${encodeURIComponent(cat)}`}
                  className="card text-decoration-none border-0 shadow-sm p-3 text-center bg-white card-producto h-100"
                >
                  <i className="bi bi-music-note text-amber fs-3 mb-2"></i>
                  <h6 className="fw-bold text-dark mb-0">{cat}</h6>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Blog para Músicos */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-amber fw-bold text-uppercase small">Comunidad & Consejos</span>
            <h2 className="fw-bold mb-2">Artículos para Músicos</h2>
            <p className="text-muted">Guías prácticas preparadas por nuestros luthiers y especialistas</p>
          </div>

          <div className="row g-4">
            {BLOGS.map((nota) => (
              <div key={nota.id} className="col-md-6">
                <div className="card h-100 border shadow-sm overflow-hidden flex-md-row">
                  <img
                    src={nota.imagen}
                    alt={nota.titulo}
                    className="col-md-5 img-fluid"
                    style={{ objectFit: 'cover', minHeight: 180 }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="card-body col-md-7 d-flex flex-column p-4">
                    <span className="badge bg-light text-dark border align-self-start mb-2">Nota #{nota.id}</span>
                    <h5 className="card-title fw-bold mb-2">{nota.titulo}</h5>
                    <p className="card-text text-secondary small mb-3">{nota.resumen}</p>
                    <div className="mt-auto">
                      <Link to="/nosotros" className="btn btn-outline-dark btn-sm">
                        Leer más <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamado de Visita a la Tienda Física */}
      <section className="py-5 bg-tolex text-white">
        <div className="container text-center py-3">
          <i className="bi bi-geo-alt-fill text-amber display-4 mb-3"></i>
          <h2 className="fw-bold mb-3">¿Prefieres probar tu instrumento en persona?</h2>
          <p className="lead text-light opacity-75 mx-auto mb-4" style={{ maxWidth: '700px' }}>
            Visítanos en nuestra tienda en <strong>Av. San Martín 452, Viña del Mar</strong>. Contamos con salas de prueba acustizadas para que pruebes guitarras, amplificadores y pedales con la asesoría de nuestro equipo.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/contacto" className="btn btn-amber btn-lg fw-bold px-4">
              <i className="bi bi-chat-dots me-2"></i>Contáctanos o Agenda una Prueba
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

