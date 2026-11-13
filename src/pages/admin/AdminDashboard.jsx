import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos as obtenerProductosLocales } from '../../data/datos';
import { useAuth } from '../../context/AuthContext';
import { listarUsuarios } from '../../services/usuarioService';
import { listarProductos, listarCriticos } from '../../services/productoService';

const secciones = [
  { ruta: '/admin/ordenes', icono: 'bi-receipt', titulo: 'Órdenes', texto: 'Compras y boletas', roles: ['ADMIN', 'VENDEDOR'] },
  { ruta: '/admin/productos', icono: 'bi-box-seam', titulo: 'Productos', texto: 'Crear, ver y editar productos', roles: ['ADMIN', 'VENDEDOR'] },
  { ruta: '/admin/productos/criticos', icono: 'bi-exclamation-triangle', titulo: 'Productos críticos', texto: 'Stock por reponer', roles: ['ADMIN'] },
  { ruta: '/admin/categorias', icono: 'bi-tags', titulo: 'Categorías', texto: 'Crear y editar categorías', roles: ['ADMIN'] },
  { ruta: '/admin/usuarios', icono: 'bi-people', titulo: 'Usuarios', texto: 'Cuentas e historial de compras', roles: ['ADMIN'] },
  { ruta: '/admin/reportes', icono: 'bi-bar-chart', titulo: 'Reportes', texto: 'Ventas e inventario', roles: ['ADMIN'] },
  { ruta: '/admin/perfil', icono: 'bi-person-circle', titulo: 'Perfil', texto: 'Mis datos', roles: ['ADMIN'] },
  { ruta: '/', icono: 'bi-shop', titulo: 'Tienda', texto: 'Ver la tienda', roles: ['ADMIN', 'VENDEDOR'] }
];

export default function AdminDashboard() {
  const { usuario: sesion, tieneRol } = useAuth();
  const esAdmin = tieneRol('ADMIN');
  const [productos, setProductos] = useState([]);
  const [criticos, setCriticos] = useState([]);
  const [totalUsuarios, setTotalUsuarios] = useState(null);

  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      try {
        const [prods, crits] = await Promise.all([
          listarProductos(),
          listarCriticos()
        ]);
        if (!cancelado) {
          setProductos(prods);
          setCriticos(crits);
        }
      } catch {
        if (!cancelado) {
          const locales = obtenerProductosLocales();
          setProductos(locales);
          setCriticos(locales.filter((p) => p.stock <= p.stockCritico));
        }
      }
    }
    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (!esAdmin) return;
    listarUsuarios()
      .then((lista) => setTotalUsuarios(lista.length))
      .catch(() => setTotalUsuarios(null));
  }, [esAdmin]);

  const totalStock = productos.reduce((acc, p) => acc + (p.stock || 0), 0);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Panel de Control — Sonido Vivo</h1>
          <p className="text-muted mb-0">{esAdmin ? 'Resumen operativo de inventario y personal' : 'Accesos del vendedor: productos y órdenes'}</p>
        </div>
        {sesion && (
          <span className="badge bg-success px-3 py-2">
            <i className="bi bi-person-check me-1"></i>{sesion.nombre}
          </span>
        )}
      </div>

      {esAdmin && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 border-start border-primary border-4 p-3">
                <span className="text-muted small fw-semibold">TOTAL PRODUCTOS</span>
                <h3 className="fw-bold my-2">{productos.length}</h3>
                <span className="text-secondary small">{totalStock} unidades en inventario</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 border-start border-danger border-4 p-3">
                <span className="text-muted small fw-semibold">STOCK CRÍTICO</span>
                <h3 className="fw-bold my-2 text-danger">{criticos.length}</h3>
                <span className="text-secondary small">Productos requieren reposición</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 border-start border-success border-4 p-3">
                <span className="text-muted small fw-semibold">USUARIOS REGISTRADOS</span>
                <h3 className="fw-bold my-2">{totalUsuarios === null ? '—' : totalUsuarios}</h3>
                <span className="text-secondary small">Administradores, vendedores y clientes</span>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
              <span className="fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>Alerta de Inventario Crítico</span>
              <span className="badge bg-light text-danger">{criticos.length} artículos</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Stock Actual</th>
                      <th>Stock Crítico</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticos.map((p) => (
                      <tr key={p.codigo}>
                        <td className="fw-bold text-monospace">{p.codigo}</td>
                        <td>{p.nombre} ({p.marca})</td>
                        <td><span className="badge bg-secondary">{p.categoria}</span></td>
                        <td className="text-danger fw-bold">{p.stock}</td>
                        <td>{p.stockCritico}</td>
                        <td><span className="badge bg-danger">Reponer urgente</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <h4 className="fw-bold mb-3">Accesos</h4>
      <div className="row g-3">
        {secciones.filter((sec) => tieneRol(...sec.roles)).map((sec) => (
          <div key={sec.ruta} className="col-6 col-md-4 col-lg-3">
            <Link to={sec.ruta} className="card h-100 p-3 shadow-sm text-center text-decoration-none text-dark card-producto">
              <i className={'bi ' + sec.icono + ' fs-2 text-amber'}></i>
              <h6 className="fw-bold mt-2 mb-1">{sec.titulo}</h6>
              <small className="text-muted">{sec.texto}</small>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
