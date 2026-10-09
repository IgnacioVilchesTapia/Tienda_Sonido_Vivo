import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Carrito() {
  const {
    items,
    cupon,
    porcentajeDescuento,
    subtotal,
    descuento,
    costoDespacho,
    total,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    aplicarCupon,
    quitarCupon
  } = useCart();

  const [inputCupon, setInputCupon] = useState('');
  const [mensajeCupon, setMensajeCupon] = useState(null);
  const [compraExitosa, setCompraExitosa] = useState(false);

  const handleAplicarCupon = (e) => {
    e.preventDefault();
    if (!inputCupon.trim()) return;

    const res = aplicarCupon(inputCupon);
    setMensajeCupon({
      tipo: res.ok ? 'success' : 'danger',
      texto: res.mensaje
    });
    setInputCupon('');
    setTimeout(() => setMensajeCupon(null), 4000);
  };

  const handleFinalizarCompra = () => {
    setCompraExitosa(true);
    vaciarCarrito();
  };

  if (compraExitosa) {
    return (
      <div className="container py-5 my-5 text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '600px' }}>
          <i className="bi bi-check-circle-fill text-success display-1 mb-3"></i>
          <h2 className="fw-bold mb-2">¡Gracias por tu compra en Sonido Vivo!</h2>
          <p className="text-muted mb-4">
            Hemos recibido tu orden con éxito. Te hemos enviado un correo de confirmación con los detalles del despacho y seguimiento.
          </p>
          <div className="p-3 bg-light rounded-3 mb-4 text-start small">
            <div><strong>Tienda:</strong> Sonido Vivo — Viña del Mar</div>
            <div><strong>Retiro o Envíos:</strong> Despacho prioritario a todo Chile</div>
            <div><strong>Consultas:</strong> contacto@sonidovivo.cl o +56 32 245 8890</div>
          </div>
          <Link to="/productos" className="btn btn-amber btn-lg fw-bold" onClick={() => setCompraExitosa(false)}>
            Seguir explorando el catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 my-5 text-center">
        <div className="py-5 bg-white rounded-3 shadow-sm border p-4 mx-auto" style={{ maxWidth: '650px' }}>
          <i className="bi bi-cart-x display-1 text-muted opacity-50 mb-3"></i>
          <h2 className="fw-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted mb-4">
            Aún no has agregado instrumentos o accesorios a tu carro de compras.
          </p>
          <Link to="/productos" className="btn btn-amber btn-lg px-4 fw-bold">
            <i className="bi bi-grid me-2"></i>Ver Productos Disponibles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Mi Carrito de Compras</h1>
          <p className="text-muted mb-0">{items.length} tipo(s) de producto en tu lista</p>
        </div>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => {
            if (window.confirm('¿Deseas vaciar todos los productos del carrito?')) {
              vaciarCarrito();
            }
          }}
        >
          <i className="bi bi-trash me-1"></i> Vaciar Carrito
        </button>
      </div>

      <div className="row g-4">
        {/* Tabla de Productos */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '45%' }}>Producto</th>
                    <th>Precio</th>
                    <th style={{ width: '20%' }}>Cantidad</th>
                    <th>Subtotal</th>
                    <th className="text-center">Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.codigo}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="rounded border"
                            style={{ width: 60, height: 60, objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                          <div>
                            <Link to={`/producto/${item.codigo}`} className="fw-bold text-dark text-decoration-none">
                              {item.nombre}
                            </Link>
                            <div className="small text-muted">{item.marca} • Código: {item.codigo}</div>
                            {item.stock <= item.stockCritico && (
                              <span className="badge bg-danger-subtle text-danger small">
                                Quedan solo {item.stock} en stock
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="fw-semibold">
                        ${item.precio.toLocaleString('es-CL')}
                      </td>
                      <td>
                        <div className="d-flex align-items-center border rounded bg-white" style={{ maxWidth: 120 }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark px-2 text-decoration-none"
                            onClick={() => actualizarCantidad(item.codigo, item.cantidad - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="px-2 fw-bold flex-grow-1 text-center small">{item.cantidad}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark px-2 text-decoration-none"
                            disabled={item.cantidad >= item.stock}
                            onClick={() => actualizarCantidad(item.codigo, item.cantidad + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold text-dark">
                        ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm border-0"
                          title="Eliminar producto"
                          onClick={() => eliminarDelCarrito(item.codigo)}
                        >
                          <i className="bi bi-trash fs-6"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer bg-white p-3 border-top d-flex justify-content-between align-items-center">
              <Link to="/productos" className="btn btn-outline-dark btn-sm">
                <i className="bi bi-arrow-left me-1"></i> Seguir Comprando
              </Link>
              <span className="small text-muted">Todos los valores con IVA incluido (19%)</span>
            </div>
          </div>
        </div>

        {/* Resumen de Compra & Cupones */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-3 p-4 bg-white mb-3">
            <h4 className="fw-bold mb-3">Resumen del Pedido</h4>

            <div className="d-flex justify-content-between my-2 text-secondary">
              <span>Subtotal:</span>
              <span className="fw-semibold text-dark">${subtotal.toLocaleString('es-CL')}</span>
            </div>

            {cupon && (
              <div className="d-flex justify-content-between my-2 text-success">
                <span>Cupón ({cupon} - {porcentajeDescuento}%):</span>
                <span className="fw-semibold">-${descuento.toLocaleString('es-CL')}</span>
              </div>
            )}

            <div className="d-flex justify-content-between my-2 text-secondary align-items-center">
              <span>Despacho a Domicilio:</span>
              {costoDespacho === 0 ? (
                <span className="badge bg-success">Gratis</span>
              ) : (
                <span className="fw-semibold text-dark">${costoDespacho.toLocaleString('es-CL')}</span>
              )}
            </div>

            {subtotal < 150000 && (
              <div className="alert alert-info py-2 px-3 small my-2">
                <i className="bi bi-info-circle me-1"></i>
                Agrega <strong>${(150000 - subtotal).toLocaleString('es-CL')}</strong> más para obtener <strong>envío gratis</strong>.
              </div>
            )}

            <hr className="my-3" />

            <div className="d-flex justify-content-between align-items-baseline mb-3">
              <span className="fs-5 fw-bold text-dark">Total a Pagar:</span>
              <span className="fs-3 fw-bold text-primary">${total.toLocaleString('es-CL')}</span>
            </div>

            <button
              className="btn btn-amber btn-lg w-100 fw-bold shadow-sm mb-3"
              onClick={handleFinalizarCompra}
            >
              <i className="bi bi-lock-fill me-2"></i>Proceder al Pago
            </button>

            {/* Caja de Cupones */}
            <div className="border-top pt-3">
              <label className="form-label small fw-semibold text-muted mb-1">
                ¿Tienes un cupón de descuento?
              </label>

              {cupon ? (
                <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded border">
                  <div>
                    <span className="badge bg-success me-2">{cupon}</span>
                    <span className="small text-muted">{porcentajeDescuento}% aplicado</span>
                  </div>
                  <button className="btn btn-link btn-sm text-danger p-0 text-decoration-none" onClick={quitarCupon}>
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAplicarCupon} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm text-uppercase"
                    placeholder="Ej: SONIDOVIVO10"
                    value={inputCupon}
                    onChange={(e) => setInputCupon(e.target.value)}
                  />
                  <button type="submit" className="btn btn-outline-dark btn-sm px-3">
                    Aplicar
                  </button>
                </form>
              )}

              {mensajeCupon && (
                <div className={`alert alert-${mensajeCupon.tipo} py-1 px-2 small mt-2 mb-0`}>
                  {mensajeCupon.texto}
                </div>
              )}

              <div className="mt-2 text-muted" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-tag me-1"></i> Cupones disponibles: <code>SONIDOVIVO10</code> (10%) o <code>MUSICO5</code> (5%).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}