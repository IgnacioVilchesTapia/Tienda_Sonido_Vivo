import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth, leerExpiracion } from './AuthContext';

function tokenFalso(segundosDeVida) {
  const exp = Math.floor(Date.now() / 1000) + segundosDeVida;
  const payload = btoa(JSON.stringify({ sub: 'fsoto2000@gmail.com', rol: 'CLIENTE', exp: exp }));
  return 'cabecera.' + payload + '.firma';
}

function Estado() {
  const { usuario, estaAutenticado, tieneRol } = useAuth();
  if (!estaAutenticado) return <div>SIN SESION</div>;
  return (
    <div>
      <span>HOLA {usuario.nombre}</span>
      <span>{tieneRol('ADMIN', 'VENDEDOR') ? 'ES PERSONAL' : 'ES CLIENTE'}</span>
    </div>
  );
}

function renderConSesion() {
  return render(
    <AuthProvider>
      <Estado />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('lee el vencimiento del token', () => {
    const token = tokenFalso(60);
    expect(leerExpiracion(token)).toBeGreaterThan(Date.now());
    expect(leerExpiracion('no-es-un-token')).toBe(0);
  });

  it('sin nada guardado no hay sesión', () => {
    renderConSesion();
    expect(screen.getByText('SIN SESION')).toBeTruthy();
  });

  it('al recargar restaura la sesión si el token sigue vigente', () => {
    localStorage.setItem('sonidoVivo.token', tokenFalso(600));
    localStorage.setItem('sonidoVivo.refreshToken', tokenFalso(6000));
    localStorage.setItem('sonidoVivo.usuario', JSON.stringify({ nombre: 'Fernanda', rol: 'CLIENTE' }));
    renderConSesion();
    expect(screen.getByText('HOLA Fernanda')).toBeTruthy();
    expect(screen.getByText('ES CLIENTE')).toBeTruthy();
  });

  it('al recargar limpia la sesión si el token y el refresh vencieron', () => {
    localStorage.setItem('sonidoVivo.token', tokenFalso(-600));
    localStorage.setItem('sonidoVivo.refreshToken', tokenFalso(-60));
    localStorage.setItem('sonidoVivo.usuario', JSON.stringify({ nombre: 'Fernanda', rol: 'CLIENTE' }));
    renderConSesion();
    expect(screen.getByText('SIN SESION')).toBeTruthy();
    expect(localStorage.getItem('sonidoVivo.token')).toBeNull();
  });

  it('tieneRol reconoce al personal de la tienda', () => {
    localStorage.setItem('sonidoVivo.token', tokenFalso(600));
    localStorage.setItem('sonidoVivo.refreshToken', tokenFalso(6000));
    localStorage.setItem('sonidoVivo.usuario', JSON.stringify({ nombre: 'Diego', rol: 'VENDEDOR' }));
    renderConSesion();
    expect(screen.getByText('ES PERSONAL')).toBeTruthy();
  });
});
