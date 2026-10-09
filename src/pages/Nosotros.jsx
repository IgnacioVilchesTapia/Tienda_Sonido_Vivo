import { Link } from 'react-router-dom';

export default function Nosotros() {
  return (
    <div className="container my-5">
      {/* Encabezado */}
      <div className="text-center mb-5">
        <span className="text-amber fw-bold text-uppercase small">Viña del Mar — Desde 2014</span>
        <h1 className="display-5 fw-bold mb-3">Nuestra Pasión es la Música</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '750px' }}>
          En Sonido Vivo conectamos a músicos principiantes, docentes y bandas profesionales con los mejores instrumentos y soluciones de audio en la Región de Valparaíso y todo Chile.
        </p>
      </div>

      {/* Historia e Instalaciones */}
      <div className="row g-5 align-items-center mb-5">
        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">Nuestra Historia</h2>
          <p className="text-secondary leading-relaxed">
            Sonido Vivo nació en 2014 en Viña del Mar como una iniciativa de músicos locales que buscaban ofrecer instrumentos de calidad verificada, asesoría transparente y un servicio de luthería confiable en la región.
          </p>
          <p className="text-secondary leading-relaxed">
            A lo largo de más de una década hemos equipado a cientos de bandas emergentes, conservatorios, colegios e instituciones en toda la quinta región, expandiendo nuestras entregas a lo largo de todo el territorio nacional con altos estándares de empaque y calibración previa.
          </p>
          <div className="p-3 bg-light rounded-3 border">
            <h6 className="fw-bold text-dark mb-1"><i className="bi bi-award text-amber me-2"></i>Compromiso de Calidad</h6>
            <p className="text-muted small mb-0">Cada instrumento acústico y eléctrico es inspeccionado y afinado antes de ser entregado a nuestros clientes.</p>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4 bg-tolex text-white rounded-3">
            <h4 className="fw-bold mb-3 text-amber">
              <i className="bi bi-shop me-2"></i>Nuestra Casa Central
            </h4>
            <ul className="list-unstyled d-flex flex-column gap-3 mb-4 text-light opacity-90 small">
              <li>
                <strong>Dirección:</strong> Av. San Martín 452, Viña del Mar
              </li>
              <li>
                <strong>Teléfono:</strong> +56 32 245 8890
              </li>
              <li>
                <strong>Email:</strong> contacto@sonidovivo.cl
              </li>
              <li>
                <strong>Horario de atención:</strong> Lun - Sáb: 10:00 a 19:30 hrs
              </li>
            </ul>
            <div className="ratio ratio-16x9 rounded overflow-hidden shadow">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0"
                title="Presentación Sonido Vivo"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Valores de la Tienda */}
      <div className="row g-4 text-center my-4">
        <div className="col-md-4">
          <div className="card p-4 h-100 border-0 bg-white shadow-sm rounded-3">
            <i className="bi bi-music-note-list text-amber display-5 mb-3"></i>
            <h5 className="fw-bold">Variedad Curada</h5>
            <p className="text-muted small mb-0">Marcas reconocidas mundialmente como Fender, Yamaha, Roland, Pearl, Shure y Boss.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 h-100 border-0 bg-white shadow-sm rounded-3">
            <i className="bi bi-person-hearts text-amber display-5 mb-3"></i>
            <h5 className="fw-bold">Atención de Músicos</h5>
            <p className="text-muted small mb-0">Te atendemos personas que tocan y conocen cada detalle técnico de lo que vendemos.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 h-100 border-0 bg-white shadow-sm rounded-3">
            <i className="bi bi-truck text-amber display-5 mb-3"></i>
            <h5 className="fw-bold">Envíos Cuidados</h5>
            <p className="text-muted small mb-0">Embalaje de máxima protección y seguro incluido para que tu instrumento llegue impecable.</p>
          </div>
        </div>
      </div>

      {/* Botón CTA Catálogo */}
      <div className="text-center mt-5">
        <Link to="/productos" className="btn btn-amber btn-lg px-5 fw-bold shadow">
          Explorar el Catálogo Completo
        </Link>
      </div>
    </div>
  );
}