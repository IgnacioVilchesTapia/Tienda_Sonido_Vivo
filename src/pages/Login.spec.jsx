import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import api from '../services/api';

function renderLogin(entrada = '/login') {
  return render(
    <MemoryRouter initialEntries={[entrada]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>PAGINA INICIO</div>} />
          <Route path="/admin/dashboard" element={<div>PANEL ADMIN</div>} />
          <Route path="/registro" element={<div>PAGINA REGISTRO</div>} />
          <Route path="/checkout" element={<div>PAGINA CHECKOUT</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

function respuestaLogin(rol) {
  return Promise.resolve({
    data: {
      token: 'token-de-prueba',
      refreshToken: 'refresh-de-prueba',
      usuario: { run: '190110222', nombre: 'Carla', apellidos: 'Pizarro Muñoz', correo: 'c.pizarro@duoc.cl', rol: rol }
    }
  });
}

describe('Login', () => {
  let user;
  beforeEach(() => {
    localStorage.clear();
    user = userEvent.setup();
  });
  afterEach(() => localStorage.clear());

  const correo = () => screen.getByPlaceholderText('ejemplo@duoc.cl');
  const clave = () => screen.getByPlaceholderText('Entre 4 y 10 caracteres');
  const enviar = () => user.click(screen.getByRole('button', { name: /Ingresar a Sonido Vivo/i }));

  it('muestra el formulario con sus campos', () => {
    renderLogin();
    expect(correo()).toBeTruthy();
    expect(clave()).toBeTruthy();
    expect(screen.getByText('Iniciar Sesión')).toBeTruthy();
  });

  it('muestra errores de campos obligatorios al enviar vacío', async () => {
    spyOn(api, 'post');
    renderLogin();
    await enviar();
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeTruthy();
    expect(screen.getByText('La contraseña es obligatoria.')).toBeTruthy();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('rechaza un dominio de correo no permitido', async () => {
    renderLogin();
    await user.type(correo(), 'alguien@hotmail.com');
    await user.type(clave(), '1234');
    await enviar();
    expect(screen.getByText(/Dominio no permitido/)).toBeTruthy();
    expect(screen.queryByText('PAGINA INICIO')).toBeNull();
  });

  it('rechaza una contraseña fuera de rango', async () => {
    renderLogin();
    await user.type(correo(), 'ana@gmail.com');
    await user.type(clave(), '123');
    await enviar();
    expect(screen.getByText('La contraseña debe tener entre 4 y 10 caracteres.')).toBeTruthy();
  });

  it('manda el correo y la contraseña al backend y redirige al inicio a un cliente', async () => {
    spyOn(api, 'post').and.callFake(() => respuestaLogin('CLIENTE'));
    renderLogin();
    await user.type(correo(), 'ana@gmail.com');
    await user.type(clave(), 'clave1');
    await enviar();
    expect(await screen.findByText('PAGINA INICIO')).toBeTruthy();
    expect(api.post).toHaveBeenCalledWith('/auth/login', { correo: 'ana@gmail.com', password: 'clave1' });
  });

  it('guarda el token y el usuario en el navegador', async () => {
    spyOn(api, 'post').and.callFake(() => respuestaLogin('CLIENTE'));
    renderLogin();
    await user.type(correo(), 'ana@gmail.com');
    await user.type(clave(), 'clave1');
    await enviar();
    await screen.findByText('PAGINA INICIO');
    expect(localStorage.getItem('sonidoVivo.token')).toBe('token-de-prueba');
    expect(JSON.parse(localStorage.getItem('sonidoVivo.usuario')).rol).toBe('CLIENTE');
  });

  it('redirige al panel admin con un administrador', async () => {
    spyOn(api, 'post').and.callFake(() => respuestaLogin('ADMIN'));
    renderLogin();
    await user.type(correo(), 'c.pizarro@duoc.cl');
    await user.type(clave(), 'admin123');
    await enviar();
    expect(await screen.findByText('PANEL ADMIN')).toBeTruthy();
  });

  it('vuelve a la página de donde venía', async () => {
    spyOn(api, 'post').and.callFake(() => respuestaLogin('CLIENTE'));
    renderLogin({ pathname: '/login', state: { desde: '/checkout' } });
    await user.type(correo(), 'ana@gmail.com');
    await user.type(clave(), 'clave1');
    await enviar();
    expect(await screen.findByText('PAGINA CHECKOUT')).toBeTruthy();
  });

  it('muestra el mensaje del servidor si la contraseña es incorrecta', async () => {
    spyOn(api, 'post').and.callFake(() => Promise.reject({
      response: { status: 401, data: { status: 401, mensaje: 'Correo o contraseña incorrectos' } }
    }));
    renderLogin();
    await user.type(correo(), 'c.pizarro@duoc.cl');
    await user.type(clave(), 'mala1');
    await enviar();
    expect(await screen.findByText('Correo o contraseña incorrectos')).toBeTruthy();
    expect(localStorage.getItem('sonidoVivo.token')).toBeNull();
  });

  it('el enlace de registro navega a /registro', async () => {
    renderLogin();
    await user.click(screen.getByRole('link', { name: /Regístrate aquí/i }));
    expect(screen.getByText('PAGINA REGISTRO')).toBeTruthy();
  });
});
