import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Boton from './Boton';
import ProductoCard from './ProductoCard';
import ProductoLista from './ProductoLista';

describe('Componentes React', () => {
  describe('Boton (Pruebas de Props y Eventos)', () => {
    it('renderiza la etiqueta de texto recibida por props', () => {
      render(<Boton texto="Comprar ahora" />);
      expect(screen.getByRole('button', { name: 'Comprar ahora' })).toBeTruthy();
    });

    it('ejecuta la funcion de evento onClick al hacer clic', async () => {
      const user = userEvent.setup();
      const handleClick = jasmine.createSpy('handleClick');
      render(<Boton texto="Pagar" onClick={handleClick} />);

      await user.click(screen.getByRole('button', { name: 'Pagar' }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('aplica las clases de estilo pasadas por props', () => {
      render(<Boton texto="Secundario" className="btn btn-secondary" />);
      const btn = screen.getByRole('button', { name: 'Secundario' });
      expect(btn.classList.contains('btn-secondary')).toBeTrue();
    });

    it('se deshabilita cuando la prop deshabilitado es true', () => {
      render(<Boton texto="Agotado" deshabilitado={true} />);
      const btn = screen.getByRole('button', { name: 'Agotado' });
      expect(btn.disabled).toBeTrue();
    });
  });

  describe('ProductoCard', () => {
    const prod = {
      codigo: 'GA001',
      nombre: 'Guitarra Acustica',
      marca: 'Yamaha',
      modelo: 'F310',
      precio: 129990,
      stock: 5,
      imagen: '/img/guitarras-acusticas.jpg'
    };

    it('muestra el nombre, marca y precio del producto', () => {
      render(
        <MemoryRouter>
          <ProductoCard producto={prod} />
        </MemoryRouter>
      );
      expect(screen.getByText('Guitarra Acustica')).toBeTruthy();
      expect(screen.getByText('Yamaha F310')).toBeTruthy();
      expect(screen.getByText('$129.990')).toBeTruthy();
    });

    it('llama a onAgregar con el producto al presionar el boton', async () => {
      const user = userEvent.setup();
      const handleAgregar = jasmine.createSpy('handleAgregar');
      render(
        <MemoryRouter>
          <ProductoCard producto={prod} onAgregar={handleAgregar} />
        </MemoryRouter>
      );

      await user.click(screen.getByRole('button', { name: 'Agregar' }));
      expect(handleAgregar).toHaveBeenCalledWith(prod);
    });

    it('muestra boton sin stock si no quedan unidades disponibles', () => {
      const agotado = { ...prod, stock: 0 };
      render(
        <MemoryRouter>
          <ProductoCard producto={agotado} />
        </MemoryRouter>
      );
      expect(screen.getByRole('button', { name: 'Sin stock' })).toBeTruthy();
    });
  });

  describe('ProductoLista (Pruebas de Renderizado)', () => {
    const lista = [
      { codigo: 'P1', nombre: 'Guitarra 1', precio: 100000, stock: 2 },
      { codigo: 'P2', nombre: 'Guitarra 2', precio: 200000, stock: 3 },
      { codigo: 'P3', nombre: 'Guitarra 3', precio: 300000, stock: 4 }
    ];

    it('renderiza todos los elementos de un conjunto de datos', () => {
      render(
        <MemoryRouter>
          <ProductoLista productos={lista} />
        </MemoryRouter>
      );
      expect(screen.getByText('Guitarra 1')).toBeTruthy();
      expect(screen.getByText('Guitarra 2')).toBeTruthy();
      expect(screen.getByText('Guitarra 3')).toBeTruthy();
    });

    it('renderiza mensaje condicional cuando la lista esta vacia', () => {
      render(
        <MemoryRouter>
          <ProductoLista productos={[]} mensajeVacio="No hay instrumentos por ahora" />
        </MemoryRouter>
      );
      expect(screen.getByText('No hay instrumentos por ahora')).toBeTruthy();
    });
  });
});
