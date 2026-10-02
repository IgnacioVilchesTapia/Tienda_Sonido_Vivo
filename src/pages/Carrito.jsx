import { useState } from 'react'
import { Link } from 'react-router-dom'
import { productosIniciales } from '../data/datos'

export default function Carrito() {
  const [items, setItems] = useState([
    { ...productosIniciales[0], cantidad: 1 },
    { ...productosIniciales[1], cantidad: 2 }
  ])
  const [cupon, setCupon] = useState('')

  const subtotal = items.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

  const handleEliminar = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleVaciar = () => {
    setItems([])
  }

  return (
    <main className="container my-4">
      <h1 className="mb-4">Mi Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="alert alert-info text-center">
          Tu carrito está vacío. <Link to="/productos">Ver productos disponibles</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>${item.precio.toLocaleString('es-CL')}</td>
                    <td>{item.cantidad}</td>
                    <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(item.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-outline-danger" onClick={handleVaciar}>
              Vaciar Carrito
            </button>
          </div>

          <div className="col-md-4">
            <div className="card p-3 bg-light">
              <h3>Resumen</h3>
              <div className="d-flex justify-content-between my-2">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="d-flex justify-content-between my-2">
                <span>Despacho:</span>
                <span className="text-success">{subtotal > 150000 ? 'Gratis' : '$3.990'}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 my-2">
                <span>Total:</span>
                <span>${(subtotal + (subtotal > 150000 ? 0 : 3990)).toLocaleString('es-CL')}</span>
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Cupón de descuento"
                  value={cupon}
                  onChange={(e) => setCupon(e.target.value)}
                />
                <button className="btn btn-outline-secondary w-100 mb-3">Aplicar Cupón</button>
              </div>

              <Link className="btn btn-success w-100" to="/checkout">
                Proceder al Pago
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}