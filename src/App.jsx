import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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
import './App.css';

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
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/productos" element={<AdminProductos />} />
            <Route path="admin/usuarios" element={<AdminUsuarios />} />
            <Route path="*" element={<PaginaNoEncontrada />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

