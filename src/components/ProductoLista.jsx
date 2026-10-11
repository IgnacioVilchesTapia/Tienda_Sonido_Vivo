import ProductoCard from './ProductoCard';

export default function ProductoLista({ productos = [], onAgregar, mensajeVacio = 'No hay productos disponibles.' }) {
  if (productos.length === 0) {
    return <p className="text-muted my-3">{mensajeVacio}</p>;
  }

  return (
    <div className="row g-4" data-testid="lista-productos">
      {productos.map((prod) => (
        <div key={prod.codigo} className="col-12 col-sm-6 col-lg-3">
          <ProductoCard producto={prod} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}
