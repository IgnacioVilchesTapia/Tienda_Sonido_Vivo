
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';


const esperarFinDeCarga = (result) =>
  waitFor(() => {
    if (result.current.loading) throw new Error('Sigue cargando');
  });

describe('useFetch', () => {
  it('devuelve los datos cuando la petición es exitosa (fetch mockeado)', async () => {
    spyOn(window, 'fetch').and.resolveTo({
      ok: true,
      json: () => Promise.resolve({ nombre: 'Guitarra' }),
    });

    const { result } = renderHook(() => useFetch('/api/productos/1'));
    expect(result.current.loading).toBeTrue();

    await esperarFinDeCarga(result);
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual({ nombre: 'Guitarra' });
    expect(result.current.error).toBeNull();
  });

  it('informa el error cuando el servidor responde con status no OK', async () => {
    spyOn(window, 'fetch').and.resolveTo({ ok: false, status: 500, statusText: 'Server Error' });

    const { result } = renderHook(() => useFetch('/api/falla'));
    await esperarFinDeCarga(result);

    expect(result.current.error).toBe('Error en la petición: 500 Server Error');
    expect(result.current.data).toBeNull();
  });

  it('informa el error cuando falla la red', async () => {
    spyOn(window, 'fetch').and.rejectWith(new Error('Sin conexión'));

    const { result } = renderHook(() => useFetch('/api/red'));
    await esperarFinDeCarga(result);

    expect(result.current.error).toBe('Sin conexión');
  });

  it('no hace fetch si no hay url', () => {
    spyOn(window, 'fetch');
    const { result } = renderHook(() => useFetch(null));
    expect(window.fetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBeFalse();
  });
});