import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTOS, CATEGORIAS } from '../../data/datos';

export default function AdminProductos() {
  const [productos, setProductos] = useState(PRODUCTOS);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevo, setNuevo] = useState({
    codigo: '',
    nombre: '',
    marca: '',
    modelo: '',
    categoria: CATEGORIAS[0],
    precio: '',
    stock: '',
    stockCritico: '3',
    descripcion: ''
  });
  const [mensaje, setMensaje] = useState(null);

  const filtrados = productos.filter((p) => {
    const coincideTexto =
      p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      p.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
      p.marca.toLowerCase().includes(filtro.toLowerCase());
    const coincideCat = categoriaFiltro ? p.categoria === categoriaFiltro : true;
    return coincideTexto && coincideCat;
  });

  const handleEliminar = (codigo) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto ${codigo}?`)) {
      setProductos(productos.filter((p) => p.codigo !== codigo));
      setMensaje({ tipo: 'success', texto: `Producto ${codigo} eliminado exitosamente.` });
      setTimeout(() => setMensaje(null), 3500);
    }
  };

  const handleGuardarNuevo = (e) => {
    e.preventDefault();
    if (!nuevo.codigo || !nuevo.nombre || !nuevo.precio || !nuevo.stock) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    if (productos.some((p) => p.codigo.toUpperCase() === nuevo.codigo.toUpperCase())) {
      alert(`El código ${nuevo.codigo.toUpperCase()} ya existe en el catálogo.`);
      return;
    }

    const prodAgregado = {
      codigo: nuevo.codigo.toUpperCase(),
      nombre: nuevo.nombre,
      marca: nuevo.marca || 'Genérica',
      modelo: nuevo.modelo || 'Estándar',
      categoria: nuevo.categoria,
      precio: parseInt(nuevo.precio, 10),
      stock: parseInt(nuevo.stock, 10),
      stockCritico: parseInt(nuevo.stockCritico, 10) || 3,
      descripcion: nuevo.descripcion || 'Instrumento musical revisado por el taller de Sonido Vivo.',
      imagen: '/img/guitarras-acusticas.jpg'
    };

    setProductos([prodAgregado, ...productos]);
    setMostrarModal(false);
    setNuevo({
      codigo: '',
      nombre: '',
      marca: '',
      modelo: '',
      categoria: CATEGORIAS[0],
      precio: '',
      stock: '',
      stockCritico: '3',
      descripcion: ''
    });
    setMensaje({ tipo: 'success', texto: `Producto ${prodAgregado.codigo} creado con éxito.` });
    setTimeout(() => setMensaje(null), 3500);
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Mantenedor de Productos</h1>
          <p className="text-muted mb-0">Gestión de inventario, altas, bajas y alertas de stock</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/dashboard" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i> Dashboard
          </Link>
          <button className="btn btn-amber fw-bold" onClick={() => setMostrarModal(true)}>
            <i className="bi bi-plus-circle me-1"></i> Nuevo Producto
          </button>
        </div>
      </div>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje(null)}></button>
        </div>
      )}

      {/* Filtros */}
      <div className="card shadow-sm p-3 mb-4 bg-white border-0">
        <div className="row g-3">
          <div className="col-md-7">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por código, nombre o marca…"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <select
              className="form-select"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Marca / Modelo</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const esCritico = p.stock <= p.stockCritico;
                return (
                  <tr key={p.codigo}>
                    <td className="fw-bold font-monospace">{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.marca} {p.modelo}</td>
                    <td><span className="badge bg-secondary">{p.categoria}</span></td>
                    <td className="fw-semibold">${p.precio.toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${esCritico ? 'bg-danger' : 'bg-success'}`}>
                        {p.stock} unid. {esCritico && '(Crítico)'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Eliminar producto"
                        onClick={() => handleEliminar(p.codigo)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white text-muted small p-3">
          Mostrando {filtrados.length} de {productos.length} productos en el inventario.
        </div>
      </div>

      {/* Modal Nuevo Producto */}
      {mostrarModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-tolex text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-box-seam me-2"></i>Alta de Nuevo Producto
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              <form onSubmit={handleGuardarNuevo}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Código *</label>
                      <input
                        type="text"
                        className="form-control text-uppercase font-monospace"
                        placeholder="Ej: GA011"
                        required
                        value={nuevo.codigo}
                        onChange={(e) => setNuevo({ ...nuevo, codigo: e.target.value })}
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Nombre del Instrumento *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Guitarra Eléctrica Custom…"
                        required
                        value={nuevo.nombre}
                        onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Marca</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Fender, Yamaha, Boss…"
                        value={nuevo.marca}
                        onChange={(e) => setNuevo({ ...nuevo, marca: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Modelo</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Player Plus, FG800…"
                        value={nuevo.modelo}
                        onChange={(e) => setNuevo({ ...nuevo, modelo: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Categoría</label>
                      <select
                        className="form-select"
                        value={nuevo.categoria}
                        onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
                      >
                        {CATEGORIAS.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Precio ($ CLP) *</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        required
                        placeholder="199990"
                        value={nuevo.precio}
                        onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Stock Inicial *</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        required
                        placeholder="10"
                        value={nuevo.stock}
                        onChange={(e) => setNuevo({ ...nuevo, stock: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Stock Crítico</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        placeholder="3"
                        value={nuevo.stockCritico}
                        onChange={(e) => setNuevo({ ...nuevo, stockCritico: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Descripción Técnica</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Especificaciones de maderas, cápsulas, herrajes…"
                        value={nuevo.descripcion}
                        onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-amber fw-bold px-4">
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
