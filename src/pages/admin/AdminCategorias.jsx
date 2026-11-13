import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from '../../services/categoriaService';
import { listarProductos } from '../../services/productoService';
import { mensajeDeError } from '../../services/api';
import { obtenerCategorias as obtenerCategoriasLocales, obtenerProductos } from '../../data/datos';

async function obtenerCategoriasAdmin() {
  try {
    const [cats, prods] = await Promise.all([listarCategorias(), listarProductos()]);
    return cats.map((cat) => ({
      ...cat,
      cantidadProductos: prods.filter((p) => p.categoria === cat.nombre).length
    }));
  } catch {
    const locales = obtenerCategoriasLocales();
    const prods = obtenerProductos();
    return locales.map((nom, idx) => ({
      id: idx + 1,
      nombre: nom,
      cantidadProductos: prods.filter((p) => p.categoria === nom).length
    }));
  }
}

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nueva, setNueva] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    obtenerCategoriasAdmin().then((datos) => {
      if (activo) {
        setCategorias(datos);
        setCargando(false);
      }
    });

    return () => {
      activo = false;
    };
  }, []);

  const cargar = async () => {
    const datos = await obtenerCategoriasAdmin();
    setCategorias(datos);
  };

  const agregar = async (e) => {
    e.preventDefault();
    const nombre = nueva.trim();
    if (nombre.length < 3) {
      alert('El nombre debe tener al menos 3 letras');
      return;
    }

    try {
      await crearCategoria({ nombre });
      setNueva('');
      setMensaje({ tipo: 'success', texto: `Categoría "${nombre}" creada exitosamente.` });
      await cargar();
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: mensajeDeError(err) });
    } finally {
      setTimeout(() => setMensaje(null), 3500);
    }
  };

  const empezarEdicion = (cat) => {
    setEditandoId(cat.id);
    setNombreEditado(cat.nombre);
  };

  const guardarEdicion = async (cat) => {
    const nombre = nombreEditado.trim();
    if (nombre.length < 3) {
      alert('El nombre debe tener al menos 3 letras');
      return;
    }

    try {
      await actualizarCategoria(cat.id, { nombre });
      setEditandoId(null);
      setMensaje({ tipo: 'success', texto: 'Categoría actualizada exitosamente.' });
      await cargar();
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: mensajeDeError(err) });
    } finally {
      setTimeout(() => setMensaje(null), 3500);
    }
  };

  const handleEliminar = async (cat) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${cat.nombre}"?`)) return;
    try {
      await eliminarCategoria(cat.id);
      setMensaje({ tipo: 'success', texto: `Categoría "${cat.nombre}" eliminada.` });
      await cargar();
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: mensajeDeError(err) });
    } finally {
      setTimeout(() => setMensaje(null), 3500);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Categorías</h1>
          <p className="text-muted mb-0">Gestión de familias de productos en el catálogo</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Dashboard
        </Link>
      </div>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje(null)}></button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <form className="card shadow-sm border-0 p-4" onSubmit={agregar}>
            <h5 className="fw-bold mb-3">Nueva categoría</h5>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Nombre de la categoría</label>
              <input
                className="form-control"
                placeholder="Ej: Accesorios para Batería"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-amber fw-bold w-100">
              <i className="bi bi-plus-circle me-1"></i> Agregar Categoría
            </button>
          </form>
        </div>

        <div className="col-lg-8">
          {cargando ? (
            <div className="text-center py-5 text-muted">Cargando categorías...</div>
          ) : (
            <div className="card shadow-sm border-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                      <th className="text-center">Productos</th>
                      <th className="text-end" style={{ minWidth: 160 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((cat) => (
                      <tr key={cat.id || cat.nombre}>
                        <td>
                          {editandoId === cat.id ? (
                            <input
                              className="form-control form-control-sm"
                              value={nombreEditado}
                              onChange={(e) => setNombreEditado(e.target.value)}
                              autoFocus
                            />
                          ) : (
                            <span className="fw-semibold">{cat.nombre}</span>
                          )}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary">
                            {cat.cantidadProductos ?? 0}
                          </span>
                        </td>
                        <td className="text-end text-nowrap">
                          {editandoId === cat.id ? (
                            <>
                              <button className="btn btn-success btn-sm me-1" onClick={() => guardarEdicion(cat)}>
                                Guardar
                              </button>
                              <button className="btn btn-light btn-sm" onClick={() => setEditandoId(null)}>
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-outline-primary btn-sm me-1"
                                onClick={() => empezarEdicion(cat)}
                                title="Editar nombre"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleEliminar(cat)}
                                title="Eliminar categoría"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer bg-white small text-muted p-3">
                {categorias.length} categorías registradas en la tienda
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
