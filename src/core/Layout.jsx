import { Outlet, NavLink, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Bar de contacto / promociones */}
      <div className="bg-tolex-dark text-white py-1 small border-bottom border-secondary border-opacity-25">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-geo-alt-fill text-amber me-1"></i>
            <span>Av. San Martín 452, Viña del Mar</span>
            <span className="mx-2 d-none d-sm-inline">|</span>
            <span className="d-none d-sm-inline"><i className="bi bi-telephone-fill text-amber me-1"></i> +56 32 245 8890</span>
          </div>
          <div>
            <span className="badge bg-warning text-dark me-2">Envío gratis sobre $150.000</span>
          </div>
        </div>
      </div>

      {/* Navbar Principal */}
      <header className="sticky-top shadow-sm">
        <nav className="navbar navbar-expand-lg navbar-dark bg-tolex py-3">
          <div className="container">
            <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white" to="/">
              <span className="bg-warning text-dark rounded-circle p-2 d-inline-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                <i className="bi bi-music-note-beamed fs-5"></i>
              </span>
              <span>SONIDO <span className="text-amber">VIVO</span></span>
            </Link>

            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navSonidoVivo"
              aria-controls="navSonidoVivo"
              aria-expanded="false"
              aria-label="Abrir navegación"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navSonidoVivo">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active text-amber fw-semibold' : ''}`} to="/">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active text-amber fw-semibold' : ''}`} to="/productos">
                    Catálogo
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active text-amber fw-semibold' : ''}`} to="/nosotros">
                    Nosotros
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active text-amber fw-semibold' : ''}`} to="/contacto">
                    Contacto
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active text-amber fw-semibold' : ''}`} to="/admin/dashboard">
                    <i className="bi bi-shield-lock me-1"></i>Admin
                  </NavLink>
                </li>
              </ul>

              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                  <i className="bi bi-person me-1"></i> Mi Cuenta
                </Link>
                <Link to="/carrito" className="btn btn-amber btn-sm px-3 position-relative d-flex align-items-center gap-2">
                  <i className="bi bi-cart3 fs-6"></i>
                  <span>Carrito</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Contenido Principal con Outlet */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer Institucional */}
      <footer className="bg-tolex text-light pt-5 pb-3 mt-auto border-top border-secondary border-opacity-25">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-soundwave text-amber fs-4"></i> Sonido Vivo
              </h5>
              <p className="text-secondary small mb-3">
                Tienda especializada en instrumentos musicales, audio profesional y accesorios en Viña del Mar desde 2014. Asesoría técnica experta para músicos principiantes e instituciones.
              </p>
              <div className="d-flex gap-2">
                <span className="badge bg-secondary">Guitarras</span>
                <span className="badge bg-secondary">Bajos</span>
                <span className="badge bg-secondary">Teclados</span>
                <span className="badge bg-secondary">Baterías</span>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <h6 className="text-uppercase text-amber fw-bold small mb-3">Navegación</h6>
              <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
                <li><Link to="/" className="text-decoration-none text-light opacity-75 hover-opacity-100">Inicio</Link></li>
                <li><Link to="/productos" className="text-decoration-none text-light opacity-75 hover-opacity-100">Catálogo Completo</Link></li>
                <li><Link to="/nosotros" className="text-decoration-none text-light opacity-75 hover-opacity-100">Quiénes Somos</Link></li>
                <li><Link to="/contacto" className="text-decoration-none text-light opacity-75 hover-opacity-100">Contacto y Soporte</Link></li>
              </ul>
            </div>

            <div className="col-6 col-md-3">
              <h6 className="text-uppercase text-amber fw-bold small mb-3">Administración</h6>
              <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
                <li><Link to="/admin/dashboard" className="text-decoration-none text-light opacity-75 hover-opacity-100">Panel de Control</Link></li>
                <li><Link to="/admin/productos" className="text-decoration-none text-light opacity-75 hover-opacity-100">Mantenedor de Productos</Link></li>
                <li><Link to="/admin/usuarios" className="text-decoration-none text-light opacity-75 hover-opacity-100">Mantenedor de Usuarios</Link></li>
                <li><Link to="/login" className="text-decoration-none text-light opacity-75 hover-opacity-100">Acceso Trabajadores</Link></li>
              </ul>
            </div>

            <div className="col-12 col-md-3">
              <h6 className="text-uppercase text-amber fw-bold small mb-3">Contacto & Tienda</h6>
              <ul className="list-unstyled small mb-0 d-flex flex-column gap-2 text-secondary">
                <li><i className="bi bi-geo-alt text-amber me-2"></i>Av. San Martín 452, Viña del Mar</li>
                <li><i className="bi bi-telephone text-amber me-2"></i>+56 32 245 8890</li>
                <li><i className="bi bi-envelope text-amber me-2"></i>contacto@sonidovivo.cl</li>
                <li><i className="bi bi-clock text-amber me-2"></i>Lun - Sáb: 10:00 a 19:30 hrs</li>
              </ul>
            </div>
          </div>

          <hr className="my-4 border-secondary opacity-25" />

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-secondary">
            <div>
              © 2026 <strong>Sonido Vivo</strong>. Todos los derechos reservados.
            </div>
            <div>
              Desarrollo Fullstack II — Duoc UC
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}