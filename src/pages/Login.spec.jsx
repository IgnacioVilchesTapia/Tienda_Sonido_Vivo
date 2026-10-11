import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>PAGINA INICIO</div>} />
        <Route path="/admin/dashboard" element={<div>PANEL ADMIN</div>} />
        <Route path="/registro" element={<div>PAGINA REGISTRO</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Login', () => {
  let user;
  beforeEach(() => { user = userEvent.setup(); });

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
    renderLogin();
    await enviar();
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeTruthy();
    expect(screen.getByText('La contraseña es obligatoria.')).toBeTruthy();
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

  it('redirige al inicio con un usuario normal', async () => {
    renderLogin();
    await user.type(correo(), 'ana@gmail.com');
    await user.type(clave(), '1234');
    await enviar();
    expect(screen.getByText('PAGINA INICIO')).toBeTruthy();
  });

  it('redirige al panel admin con el correo del administrador', async () => {
    renderLogin();
    await user.type(correo(), 'c.pizarro@duoc.cl');
    await user.type(clave(), '1234');
    await enviar();
    expect(screen.getByText('PANEL ADMIN')).toBeTruthy();
  });

  it('el enlace de registro navega a /registro', async () => {
    renderLogin();
    await user.click(screen.getByRole('link', { name: /Regístrate aquí/i }));
    expect(screen.getByText('PAGINA REGISTRO')).toBeTruthy();
  });
});