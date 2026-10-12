import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerProductoPorCodigo, actualizarProducto, obtenerCategorias } from '../../data/datos';

export default function AdminProductoDetalle() {
  const { codigo } = useParams();
  const [producto, setProducto] = useState(() => obtenerProductoPorCodigo(codigo));
  const [categorias] = useState(() => obtenerCategorias());
  const [form, setForm] = useState(producto ? { ...producto } : null);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  if (!producto) {
    return (
      <div className="container my-5 text-center">
        <h2 className="fw-bold">Producto no encontrado</h2>
        <Link to="/admin/productos" className="btn btn-amber mt-3">Volver a productos</Link>
      </div>
    );
  }

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = (e) => {
    e.preventDefault();
    if (form.nombre.trim() === '' || form.precio === '' || form.stock === '') {
      alert('El nombre, precio y stock son obligatorios');
      return;
    }
    if (Number(form.precio) < 0 || Number(form.stock) < 0) {
      alert('El precio y el stock no pueden ser negativos');
      return;
    }

    const actualizado = {
      ...form,
      precio: parseInt(form.precio),
      stock: parseInt(form.stock),
      stockCritico: parseInt(form.stockCritico) || 3
    };

    actualizarProducto(producto.codigo, actualizado);
    setProducto(actualizado);
    setEditando(false);
    setMensaje('Producto actualizado correctamente');
    setTimeout(() => setMensaje(''), 3000);
  };

  const cancelar = () => {
    setForm({ ...producto });
    setEditando(false);
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">{editando ? 'Editar producto' : 'Detalle del producto'}</h1>
          <p className="text-muted mb-0">Código {producto.codigo}</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/productos" className="btn btn-outline-secondary">Volver al listado</Link>
          {!editando && (
            <button className="btn btn-amber fw-bold" onClick={() => setEditando(true)}>
              <i className="bi bi-pencil me-1"></i>Editar
            </button>
          )}
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      {!editando ? (
        <div className="card shadow-sm border-0 p-4">
          <div className="row g-4">
            <div className="col-md-4">
              <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded border" />
            </div>
            <div className="col-md-8">
              <h3 className="fw-bold">{producto.nombre}</h3>
              <table className="table table-sm">
                <tbody>
                  <tr><th style={{ width: 160 }}>Categoría</th><td>{producto.categoria}</td></tr>
                  <tr><th>Marca</th><td>{producto.marca}</td></tr>
                  <tr><th>Modelo</th><td>{producto.modelo}</td></tr>
                  <tr><th>Precio</th><td>${producto.precio.toLocaleString('es-CL')}</td></tr>
                  <tr>
                    <th>Stock</th>
                    <td>
                      {producto.stock} unidades{' '}
                      {producto.stock <= producto.stockCritico && <span className="badge bg-danger">Crítico</span>}
                    </td>
                  </tr>
                  <tr><th>Stock crítico</th><td>{producto.stockCritico}</td></tr>
                  <tr><th>Descripción</th><td>{producto.descripcion}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <form className="card shadow-sm border-0 p-4" onSubmit={guardar}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Código</label>
              <input className="form-control" value={form.codigo} disabled />
            </div>
            <div className="col-md-8">
              <label className="form-label small fw-semibold">Nombre *</label>
              <input name="nombre" className="form-control" value={form.nombre} onChange={cambiar} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Marca</label>
              <input name="marca" className="form-control" value={form.marca} onChange={cambiar} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Modelo</label>
              <input name="modelo" className="form-control" value={form.modelo} onChange={cambiar} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Categoría</label>
              <select name="categoria" className="form-select" value={form.categoria} onChange={cambiar}>
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Precio *</label>
              <input name="precio" type="number" className="form-control" value={form.precio} onChange={cambiar} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Stock *</label>
              <input name="stock" type="number" className="form-control" value={form.stock} onChange={cambiar} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Stock crítico</label>
              <input name="stockCritico" type="number" className="form-control" value={form.stockCritico} onChange={cambiar} />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">Descripción</label>
              <textarea name="descripcion" className="form-control" rows="3" value={form.descripcion} onChange={cambiar}></textarea>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={cancelar}>Cancelar</button>
            <button type="submit" className="btn btn-amber fw-bold">Guardar cambios</button>
          </div>
        </form>
      )}
    </div>
  );
}
