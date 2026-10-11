import { PRODUCTOS, CATEGORIAS, obtenerProductoPorCodigo, obtenerProductosRelacionados } from './datos';
import { REGIONES, obtenerComunasPorRegion } from './regiones';

describe('datos.js', () => {
  it('los códigos de producto son únicos', () => {
    const codigos = PRODUCTOS.map((p) => p.codigo);
    expect(new Set(codigos).size).toBe(codigos.length);
  });

  it('todos los productos pertenecen a una categoría existente y tienen precio > 0', () => {
    PRODUCTOS.forEach((p) => {
      expect(CATEGORIAS).toContain(p.categoria);
      expect(p.precio).toBeGreaterThan(0);
    });
  });

  describe('obtenerProductoPorCodigo', () => {
    it('encuentra un producto sin importar mayúsculas', () => {
      expect(obtenerProductoPorCodigo('ga001').codigo).toBe('GA001');
    });
    it('devuelve null si no existe o no se entrega código', () => {
      expect(obtenerProductoPorCodigo('NOEXISTE')).toBeNull();
      expect(obtenerProductoPorCodigo('')).toBeNull();
      expect(obtenerProductoPorCodigo(undefined)).toBeNull();
    });
  });

  describe('obtenerProductosRelacionados', () => {
    it('devuelve productos de la misma categoría excluyendo el actual', () => {
      const rel = obtenerProductosRelacionados('Guitarras Acústicas', 'GA001');
      expect(rel.length).toBeGreaterThan(0);
      rel.forEach((p) => {
        expect(p.categoria).toBe('Guitarras Acústicas');
        expect(p.codigo).not.toBe('GA001');
      });
    });
    it('respeta el límite', () => {
      expect(obtenerProductosRelacionados('Guitarras Acústicas', 'GA001', 2).length).toBe(2);
    });
  });
});

describe('regiones.js', () => {
  it('devuelve las comunas de una región', () => {
    expect(obtenerComunasPorRegion('Región de Valparaíso')).toContain('Viña del Mar');
  });
  it('devuelve arreglo vacío si la región no existe', () => {
    expect(obtenerComunasPorRegion('Región Inventada')).toEqual([]);
    expect(obtenerComunasPorRegion('')).toEqual([]);
  });
  it('todas las regiones tienen al menos una comuna', () => {
    REGIONES.forEach((r) => expect(r.comunas.length).toBeGreaterThan(0));
  });
});