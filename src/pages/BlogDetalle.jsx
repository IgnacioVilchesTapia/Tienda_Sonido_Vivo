import { useParams, Link } from 'react-router-dom';
import { BLOGS } from '../data/datos';

export default function BlogDetalle() {
  const { id } = useParams();
  const blog = BLOGS.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <div className="container my-5 text-center">
        <h2 className="fw-bold">No encontramos esa nota</h2>
        <Link to="/blogs" className="btn btn-amber mt-3">Volver a las noticias</Link>
      </div>
    );
  }

  const otras = BLOGS.filter((b) => b.id !== blog.id);

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/blogs">Blogs</Link></li>
          <li className="breadcrumb-item active">{blog.titulo}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-lg-8">
          <h1 className="fw-bold">{blog.titulo}</h1>
          <p className="text-muted small">Publicado por el equipo de Sonido Vivo el {blog.fecha}</p>
          <img src={blog.imagen} alt={blog.titulo} className="img-fluid rounded mb-4 w-100" style={{ maxHeight: 380, objectFit: 'cover' }} />

          {blog.contenido.map((parte, i) => (
            <div key={i} className="mb-3">
              {parte.subtitulo && <h4 className="fw-bold mt-4">{parte.subtitulo}</h4>}
              <p>{parte.texto}</p>
            </div>
          ))}

          <Link
            to={'/productos?categoria=' + encodeURIComponent(blog.categoria)}
            className="btn btn-amber mt-2"
          >
            Ver {blog.categoria.toLowerCase()} disponibles
          </Link>
        </div>

        <div className="col-lg-4">
          <div className="card p-3 bg-light border-0">
            <h5 className="fw-bold">Otras notas</h5>
            {otras.map((o) => (
              <div key={o.id} className="border-top pt-2 mt-2">
                <Link to={'/blogs/' + o.id} className="fw-semibold text-decoration-none">{o.titulo}</Link>
                <p className="small text-muted mb-1">{o.resumen}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
