import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productosIniciales } from '../data/datos'

export default function DetalleProducto() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    const encontrado = productosIniciales.find((p) => p.id === parseInt(id))
    setProducto(encontrado)
  }, [id])

  const handleAgregarCarrito = () => {
    alert(`Se agregaron ${cantidad} unidad(es) de "${producto.nombre}" al carrito.`)
  }

  if (!producto) {
    return (
      <div className="container my-5 text-center">
        <h2>Producto no encontrado</h2>
        <Link className="btn btn-secondary mt-3" to="/productos">Volver al catálogo</Link>
      </div>
    )
  }

  return (
    <main className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <img src={producto.imagen || '[https://via.placeholder.com/400x300](https://via.placeholder.com/400x300)'} className="img-fluid rounded border" alt={producto.nombre} />
        </div>
        <div className="col-md-6">
          <h1>{producto.nombre}</h1>
          <span className="badge bg-secondary mb-3">{producto.categoria}</span>
          <h3 className="text-primary">${producto.precio.toLocaleString('es-CL')}</h3>
          <p className="mt-3">{producto.descripcion || 'Instrumento musical de excelente calidad, revisado por nuestros especialistas.'}</p>
          
          <div className="d-flex align-items-center mb-3">
            <label className="me-2 fw-bold">Cantidad:</label>
            <input
              type="number"
              className="form-control w-25"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
            />
          </div>

          <button className="btn btn-success btn-lg w-100 mb-2" onClick={handleAgregarCarrito}>
            Añadir al Carrito
          </button>
          <Link className="btn btn-outline-secondary w-100" to="/productos">
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  )
}