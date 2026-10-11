import { Link } from 'react-router-dom';
import { BLOGS } from '../data/datos';

export default function Blogs() {
  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-1">Noticias importantes</h1>
      <p className="text-muted mb-4">
        Lo que preguntan los músicos en el mesón, contestado acá para que no tengas que venir a preguntarlo.
      </p>

      <div className="row g-4">
        {BLOGS.map((b) => (
          <div className="col-12 col-md-6" key={b.id}>
            <div className="card h-100 shadow-sm">
              <img src={b.imagen} className="card-img-top" alt={b.titulo} style={{ height: 220, objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <small className="text-muted mb-1">{b.fecha}</small>
                <h5 className="fw-bold">{b.titulo}</h5>
                <p className="text-secondary">{b.resumen}</p>
                <Link to={'/blogs/' + b.id} className="btn btn-outline-dark btn-sm mt-auto align-self-start">
                  Leer nota
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
