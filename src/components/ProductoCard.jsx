import { Link } from 'react-router-dom';
import Boton from './Boton';

export default function ProductoCard({ producto, onAgregar }) {
  if (!producto) return null;

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={producto.imagen}
        className="card-img-top img-producto-cover"
        alt={producto.nombre}
      />
      <div className="card-body d-flex flex-column">
        <h6 className="fw-bold mb-1">{producto.nombre}</h6>
        <p className="text-muted small mb-2">{producto.marca} {producto.modelo}</p>
        <p className="fw-bold fs-5 mt-auto mb-3">${producto.precio ? producto.precio.toLocaleString('es-CL') : '0'}</p>
        <div className="d-flex gap-2">
          <Link to={`/producto/${producto.codigo}`} className="btn btn-outline-secondary btn-sm w-50">
            Ver
          </Link>
          <Boton
            texto={producto.stock === 0 ? 'Sin stock' : 'Agregar'}
            className="btn btn-amber btn-sm w-50"
            deshabilitado={producto.stock === 0}
            onClick={() => onAgregar && onAgregar(producto)}
          />
        </div>
      </div>
    </div>
  );
}
