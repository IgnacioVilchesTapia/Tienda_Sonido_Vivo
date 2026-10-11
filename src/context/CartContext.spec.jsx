import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const guitarra = { codigo: 'GA001', nombre: 'Guitarra Folk', precio: 100000, stock: 3 };
const bateria = { codigo: 'BT001', nombre: 'Batería 5 piezas', precio: 200000, stock: 5 };

describe('CartContext', () => {
  beforeEach(() => localStorage.clear());
  afterAll(() => localStorage.clear());

  it('lanza error si useCart se usa fuera del CartProvider', () => {
    spyOn(console, 'error');
    expect(() => renderHook(() => useCart())).toThrowError(/CartProvider/);
  });

  it('inicia con el carrito vacío', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.costoDespacho).toBe(0);
  });

  describe('agregarAlCarrito', () => {
    it('agrega un producto y calcula subtotal, despacho y total', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      let res;
      act(() => { res = result.current.agregarAlCarrito(guitarra, 1); });

      expect(res.ok).toBeTrue();
      expect(result.current.items.length).toBe(1);
      expect(result.current.cantidadTotal).toBe(1);
      expect(result.current.subtotal).toBe(100000);
      expect(result.current.costoDespacho).toBe(4990);
      expect(result.current.total).toBe(104990);
    });

    it('suma la cantidad si el producto ya existe', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito(guitarra, 1); });
      act(() => { result.current.agregarAlCarrito(guitarra, 1); });

      expect(result.current.items.length).toBe(1);
      expect(result.current.items[0].cantidad).toBe(2);
    });

    it('rechaza si se supera el stock', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito(guitarra, 3); });
      let res;
      act(() => { res = result.current.agregarAlCarrito(guitarra, 1); });

      expect(res.ok).toBeFalse();
      expect(res.mensaje).toContain('No puedes agregar más de 3');
      expect(result.current.items[0].cantidad).toBe(3);
    });

    it('rechaza un producto inválido', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      let res;
      act(() => { res = result.current.agregarAlCarrito(null); });
      expect(res.ok).toBeFalse();
      expect(res.mensaje).toBe('Producto inválido');
    });
  });

  describe('actualizarCantidad / eliminarDelCarrito', () => {
    it('actualiza la cantidad respetando el stock máximo', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito(guitarra, 1); });
      act(() => { result.current.actualizarCantidad('GA001', 99); });
      expect(result.current.items[0].cantidad).toBe(3);
    });

    it('elimina el producto si la cantidad es 0 o inválida', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito(guitarra, 2); });
      act(() => { result.current.actualizarCantidad('GA001', 0); });
      expect(result.current.items.length).toBe(0);
    });

    it('elimina un producto con eliminarDelCarrito', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito(guitarra, 1); });
      act(() => { result.current.eliminarDelCarrito('GA001'); });
      expect(result.current.items).toEqual([]);
    });
  });

  describe('cupones', () => {
    it('aplica SONIDOVIVO10 (10%) y deja despacho gratis sobre $150.000', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito(bateria, 1); });
      let res;
      act(() => { res = result.current.aplicarCupon('sonidovivo10'); });

      expect(res.ok).toBeTrue();
      expect(result.current.cupon).toBe('SONIDOVIVO10');
      expect(result.current.porcentajeDescuento).toBe(10);
      expect(result.current.descuento).toBe(20000);
      expect(result.current.costoDespacho).toBe(0);
      expect(result.current.total).toBe(180000);
    });

    it('aplica MUSICO5 (5%)', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito(guitarra, 1); });
      act(() => { result.current.aplicarCupon('MUSICO5'); });
      expect(result.current.descuento).toBe(5000);
      expect(result.current.total).toBe(100000 - 5000 + 4990);
    });

    it('rechaza un cupón inválido', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      let res;
      act(() => { res = result.current.aplicarCupon('FALSO123'); });
      expect(res.ok).toBeFalse();
      expect(result.current.cupon).toBe('');
      expect(result.current.descuento).toBe(0);
    });

    it('quita el cupón', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.aplicarCupon('MUSICO5'); });
      act(() => { result.current.quitarCupon(); });
      expect(result.current.cupon).toBe('');
    });
  });

  describe('despacho (regla 5)', () => {
    it('cobra $4.990 cuando el subtotal es exactamente $150.000', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito({ codigo: 'X1', nombre: 'Prueba', precio: 150000, stock: 2 }, 1); });
      expect(result.current.costoDespacho).toBe(4990);
    });

    it('es gratis con subtotal de $150.001', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito({ codigo: 'X2', nombre: 'Prueba', precio: 150001, stock: 2 }, 1); });
      expect(result.current.costoDespacho).toBe(0);
    });
  });

  describe('persistencia y vaciado', () => {
    it('guarda el carrito en localStorage', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito(guitarra, 2); });
      const guardado = JSON.parse(localStorage.getItem('sonidoVivo.carrito'));
      expect(guardado.length).toBe(1);
      expect(guardado[0].cantidad).toBe(2);
    });

    it('recupera el carrito guardado al montar el provider', () => {
      localStorage.setItem('sonidoVivo.carrito', JSON.stringify([{ ...guitarra, cantidad: 2 }]));
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.items.length).toBe(1);
      expect(result.current.cantidadTotal).toBe(2);
    });

    it('si localStorage tiene JSON corrupto, inicia vacío', () => {
      localStorage.setItem('sonidoVivo.carrito', '{no-es-json');
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.items).toEqual([]);
    });

    it('vaciarCarrito limpia items y cupón', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      act(() => { result.current.agregarAlCarrito(guitarra, 1); });
      act(() => { result.current.aplicarCupon('MUSICO5'); });
      act(() => { result.current.vaciarCarrito(); });
      expect(result.current.items).toEqual([]);
      expect(result.current.cupon).toBe('');
      expect(localStorage.getItem('sonidoVivo.cupon')).toBeNull();
    });
  });
});