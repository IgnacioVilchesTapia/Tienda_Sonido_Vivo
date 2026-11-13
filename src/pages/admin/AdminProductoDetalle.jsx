import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerProducto, actualizarProducto } from '../../services/productoService';
import { listarCategorias } from '../../services/categoriaService';
import { mensajeDeError } from '../../services/api';
import { obtenerProductoPorCodigo, obtenerCategorias } from '../../data/datos';

export default function AdminProductoDetalle() {
  const { codigo } = useParams();
  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(null);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [errorCarga, setErrorCarga] = useState('');

  useEffect(() => {
    Promise.all([
      obtenerProducto(codigo),
      listarCategorias()
    ])
      .then(([prod, cats]) => {
        setProducto(prod);
        setForm({ ...prod });
        setCategorias(cats.map((c) => (typeof c === 'string' ? c : c.nombre)));
      })
      .catch((err) => {
        const local = obtenerProductoPorCodigo(codigo);
        if (local) {
          setProducto(local);
          setForm({ ...local });
          setCategorias(obtenerCategorias());
        } else {
          setErrorCarga(mensajeDeError(err));
        }
      })
      .finally(() => setCargando(false));
  }, [codigo]);

  if (cargando) {
    return <div className="container my-5 text-center text-muted">Cargando producto...</div>;
  }

  if (!producto) {
    return (
      <div className="container my-5 text-center">
        <h2 className="fw-bold">Producto no encontrado</h2>
        <p className="text-muted">{errorCarga || `No existe un producto con código ${codigo}.`}</p>
        <Link to="/admin/productos" className="btn btn-amber mt-3">Volver a productos</Link>
      </div>
    );
  }

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e) => {
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
      precio: parseInt(form.precio, 10),
      stock: parseInt(form.stock, 10),
      stockCritico: parseInt(form.stockCritico, 10) || 3
    };

    try {
      const res = await actualizarProducto(producto.codigo, actualizado);
      setProducto(res || actualizado);
      setEditando(false);
      setMensaje('Producto actualizado correctamente');
    } catch (err) {
      alert(mensajeDeError(err));
    } finally {
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">{producto.nombre}</h1>
          <p className="text-muted mb-0">Código: <span className="font-monospace fw-bold">{producto.codigo}</span></p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/productos" className="btn btn-outline-secondary">Volver al listado</Link>
          {!editando && (
            <button className="btn btn-amber fw-bold" onClick={() => { setForm({ ...producto }); setEditando(true); }}>
              Editar
            </button>
          )}
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      {!editando ? (
        <div className="card shadow-sm border-0 p-4 mb-4">
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '250px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-sm-6">
                  <p className="mb-1 text-muted small">Marca / Modelo</p>
                  <p className="fw-semibold mb-0">{producto.marca} {producto.modelo}</p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-1 text-muted small">Categoría</p>
                  <span className="badge bg-secondary">{producto.categoria}</span>
                </div>
                <div className="col-sm-6">
                  <p className="mb-1 text-muted small">Precio</p>
                  <p className="fw-bold fs-4 text-primary mb-0">${producto.precio.toLocaleString('es-CL')}</p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-1 text-muted small">Stock Disponible / Crítico</p>
                  <p className="mb-0">
                    <span className={`badge ${producto.stock <= producto.stockCritico ? 'bg-danger' : 'bg-success'} fs-6`}>
                      {producto.stock} unidades
                    </span>{' '}
                    <span className="text-muted small">(Crítico: {producto.stockCritico})</span>
                  </p>
                </div>
                <div className="col-12">
                  <p className="mb-1 text-muted small">Descripción Técnica</p>
                  <p className="text-secondary mb-0">{producto.descripcion || 'Sin descripción adicional.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="card shadow-sm border-0 p-4 mb-4" onSubmit={guardar}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Código</label>
              <input className="form-control" value={form.codigo} disabled />
            </div>
            <div className="col-md-8">
              <label className="form-label small fw-semibold">Nombre del Instrumento</label>
              <input name="nombre" className="form-control" value={form.nombre} onChange={cambiar} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Marca</label>
              <input name="marca" className="form-control" value={form.marca} onChange={cambiar} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Modelo</label>
              <input name="modelo" className="form-control" value={form.modelo} onChange={cambiar} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Categoría</label>
              <select name="categoria" className="form-select" value={form.categoria} onChange={cambiar}>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Precio ($ CLP)</label>
              <input type="number" name="precio" className="form-control" value={form.precio} onChange={cambiar} min="0" required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Stock Actual</label>
              <input type="number" name="stock" className="form-control" value={form.stock} onChange={cambiar} min="0" required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Stock Crítico</label>
              <input type="number" name="stockCritico" className="form-control" value={form.stockCritico} onChange={cambiar} min="1" required />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">Descripción Técnica</label>
              <textarea name="descripcion" className="form-control" rows="3" value={form.descripcion} onChange={cambiar}></textarea>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
            <button type="submit" className="btn btn-amber fw-bold">Guardar Cambios</button>
          </div>
        </form>
      )}
    </div>
  );
}
