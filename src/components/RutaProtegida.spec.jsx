import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import RutaProtegida from './RutaProtegida';
import SoloRol from './SoloRol';

function tokenFalso(segundosDeVida) {
  const exp = Math.floor(Date.now() / 1000) + segundosDeVida;
  return 'cabecera.' + btoa(JSON.stringify({ exp: exp })) + '.firma';
}

function iniciarSesionComo(rol) {
  localStorage.setItem('sonidoVivo.token', tokenFalso(600));
  localStorage.setItem('sonidoVivo.refreshToken', tokenFalso(6000));
  localStorage.setItem('sonidoVivo.usuario', JSON.stringify({ nombre: 'Prueba', rol: rol }));
}

function renderEn(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>PAGINA LOGIN</div>} />
          <Route path="/acceso-denegado" element={<div>ACCESO DENEGADO</div>} />
          <Route path="/admin/dashboard" element={<RutaProtegida roles={['ADMIN', 'VENDEDOR']}><div>PANEL</div></RutaProtegida>} />
          <Route path="/admin/usuarios" element={<RutaProtegida roles={['ADMIN']}><div>USUARIOS</div></RutaProtegida>} />
          <Route
            path="/admin/productos"
            element={
              <RutaProtegida roles={['ADMIN', 'VENDEDOR']}>
                <div>PRODUCTOS</div>
                <SoloRol roles={['ADMIN']}><button>Nuevo producto</button></SoloRol>
              </RutaProtegida>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('RutaProtegida y SoloRol', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('sin sesión manda al login', () => {
    renderEn('/admin/dashboard');
    expect(screen.getByText('PAGINA LOGIN')).toBeTruthy();
  });

  it('un cliente no entra al panel', () => {
    iniciarSesionComo('CLIENTE');
    renderEn('/admin/dashboard');
    expect(screen.getByText('ACCESO DENEGADO')).toBeTruthy();
  });

  it('un vendedor entra al panel pero no a usuarios', () => {
    iniciarSesionComo('VENDEDOR');
    renderEn('/admin/usuarios');
    expect(screen.getByText('ACCESO DENEGADO')).toBeTruthy();
  });

  it('el administrador entra a usuarios', () => {
    iniciarSesionComo('ADMIN');
    renderEn('/admin/usuarios');
    expect(screen.getByText('USUARIOS')).toBeTruthy();
  });

  it('el vendedor ve los productos sin el botón de crear', () => {
    iniciarSesionComo('VENDEDOR');
    renderEn('/admin/productos');
    expect(screen.getByText('PRODUCTOS')).toBeTruthy();
    expect(screen.queryByText('Nuevo producto')).toBeNull();
  });

  it('el administrador ve el botón de crear', () => {
    iniciarSesionComo('ADMIN');
    renderEn('/admin/productos');
    expect(screen.getByText('Nuevo producto')).toBeTruthy();
  });
});
