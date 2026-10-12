import { useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos, actualizarProducto, obtenerCategorias, guardarCategorias } from '../../data/datos';

export default function AdminCategorias() {
  const [lista, setLista] = useState(() => obtenerCategorias());
  const [productos, setProductos] = useState(() => obtenerProductos());
  const [nueva, setNueva] = useState('');
  const [editando, setEditando] = useState('');
  const [nombreEditado, setNombreEditado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const contar = (cat) => productos.filter((p) => p.categoria === cat).length;
  const existe = (nombre) => lista.some((c) => c.toLowerCase() === nombre.toLowerCase());

  const agregar = (e) => {
    e.preventDefault();
    const nombre = nueva.trim();
    if (nombre.length < 3) {
      alert('El nombre debe tener al menos 3 letras');
      return;
    }
    if (existe(nombre)) {
      alert('Esa categoría ya existe');
      return;
    }
    const nuevaLista = [...lista, nombre];
    guardarCategorias(nuevaLista);
    setLista(nuevaLista);
    setNueva('');
    setMensaje('Categoría "' + nombre + '" creada');
  };

  const empezarEdicion = (cat) => {
    setEditando(cat);
    setNombreEditado(cat);
  };

  const guardarEdicion = (cat) => {
    const nombre = nombreEditado.trim();
    if (nombre.length < 3) {
      alert('El nombre debe tener al menos 3 letras');
      return;
    }
    if (nombre !== cat && existe(nombre)) {
      alert('Esa categoría ya existe');
      return;
    }
    const nuevaLista = lista.map((c) => (c === cat ? nombre : c));
    guardarCategorias(nuevaLista);
    productos.forEach((p) => {
      if (p.categoria === cat) actualizarProducto(p.codigo, { categoria: nombre });
    });
    setProductos(obtenerProductos());
    setLista(nuevaLista);
    setEditando('');
    setMensaje('Categoría actualizada');
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Categorías</h1>
          <p className="text-muted mb-0">Crear y editar las categorías de la tienda</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Dashboard
        </Link>
      </div>

      {mensaje && (
        <div className="alert alert-success alert-dismissible">
          {mensaje}
          <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <form className="card shadow-sm border-0 p-3" onSubmit={agregar}>
            <h5 className="fw-bold">Nueva categoría</h5>
            <input
              className="form-control mb-2"
              placeholder="Ej: Instrumentos de viento"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
            />
            <button type="submit" className="btn btn-amber fw-bold">Agregar</button>
          </form>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Productos</th>
                    <th style={{ width: 170 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((cat) => (
                    <tr key={cat}>
                      <td>
                        {editando === cat ? (
                          <input
                            className="form-control form-control-sm"
                            value={nombreEditado}
                            onChange={(e) => setNombreEditado(e.target.value)}
                          />
                        ) : (
                          cat
                        )}
                      </td>
                      <td><span className="badge bg-secondary">{contar(cat)}</span></td>
                      <td>
                        {editando === cat ? (
                          <>
                            <button className="btn btn-success btn-sm me-1" onClick={() => guardarEdicion(cat)}>Guardar</button>
                            <button className="btn btn-light btn-sm" onClick={() => setEditando('')}>Cancelar</button>
                          </>
                        ) : (
                          <button className="btn btn-outline-primary btn-sm" onClick={() => empezarEdicion(cat)}>
                            <i className="bi bi-pencil me-1"></i>Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
