import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './core/Layout';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Contacto from './pages/Contacto';
import Nosotros from './pages/Nosotros';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductos from './pages/admin/AdminProductos';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Blogs from './pages/Blogs';
import BlogDetalle from './pages/BlogDetalle';
import Checkout from './pages/Checkout';
import CompraExitosa from './pages/CompraExitosa';
import PagoError from './pages/PagoError';
import AdminOrdenes from './pages/admin/AdminOrdenes';
import AdminBoleta from './pages/admin/AdminBoleta';
import AdminProductoDetalle from './pages/admin/AdminProductoDetalle';
import AdminCriticos from './pages/admin/AdminCriticos';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminUsuarioDetalle from './pages/admin/AdminUsuarioDetalle';
import AdminReportes from './pages/admin/AdminReportes';
import AdminPerfil from './pages/admin/AdminPerfil';
import AccesoDenegado from './pages/AccesoDenegado';
import RutaProtegida from './components/RutaProtegida';
import './App.css';

const SOLO_ADMIN = ['ADMIN'];
const PERSONAL = ['ADMIN', 'VENDEDOR'];
const SOLO_CLIENTE = ['CLIENTE'];

function PaginaNoEncontrada() {
  return (
    <div className="container py-5 text-center my-5">
      <i className="bi bi-exclamation-octagon text-amber display-1"></i>
      <h1 className="fw-bold mt-3">404 — Página no encontrada</h1>
      <p className="text-muted">La ruta que buscas no existe en Sonido Vivo.</p>
      <Link to="/" className="btn btn-amber mt-2">
        <i className="bi bi-house-door me-1"></i> Volver al Inicio
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="productos" element={<Productos />} />
              <Route path="producto/:codigo" element={<ProductoDetalle />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />
              <Route path="contacto" element={<Contacto />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="ofertas" element={<Ofertas />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/:id" element={<BlogDetalle />} />
              <Route path="checkout" element={<RutaProtegida roles={SOLO_CLIENTE}><Checkout /></RutaProtegida>} />
              <Route path="compra-exitosa" element={<CompraExitosa />} />
              <Route path="pago-error" element={<PagoError />} />
              <Route path="admin/dashboard" element={<RutaProtegida roles={PERSONAL}><AdminDashboard /></RutaProtegida>} />
              <Route path="admin/productos" element={<RutaProtegida roles={PERSONAL}><AdminProductos /></RutaProtegida>} />
              <Route path="admin/productos/criticos" element={<RutaProtegida roles={SOLO_ADMIN}><AdminCriticos /></RutaProtegida>} />
              <Route path="admin/productos/:codigo" element={<RutaProtegida roles={PERSONAL}><AdminProductoDetalle /></RutaProtegida>} />
              <Route path="admin/usuarios" element={<RutaProtegida roles={SOLO_ADMIN}><AdminUsuarios /></RutaProtegida>} />
              <Route path="admin/usuarios/:run" element={<RutaProtegida roles={SOLO_ADMIN}><AdminUsuarioDetalle /></RutaProtegida>} />
              <Route path="admin/ordenes" element={<RutaProtegida roles={PERSONAL}><AdminOrdenes /></RutaProtegida>} />
              <Route path="admin/ordenes/:numero" element={<RutaProtegida roles={PERSONAL}><AdminBoleta /></RutaProtegida>} />
              <Route path="admin/categorias" element={<RutaProtegida roles={SOLO_ADMIN}><AdminCategorias /></RutaProtegida>} />
              <Route path="admin/reportes" element={<RutaProtegida roles={SOLO_ADMIN}><AdminReportes /></RutaProtegida>} />
              <Route path="admin/perfil" element={<RutaProtegida roles={SOLO_ADMIN}><AdminPerfil /></RutaProtegida>} />
                <Route path="acceso-denegado" element={<AccesoDenegado />} />
              <Route path="*" element={<PaginaNoEncontrada />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;

