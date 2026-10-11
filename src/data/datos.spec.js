import {
  PRODUCTOS,
  CATEGORIAS,
  obtenerProductoPorCodigo,
  obtenerProductosRelacionados,
  obtenerProductos,
  guardarProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerUsuarios,
  guardarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorRun,
  obtenerUsuarioActivo,
  guardarUsuarioActivo,
  cerrarSesion
} from './datos';
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

  describe('CRUD de productos con localStorage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('inicializa productos desde el catalogo base si localStorage esta vacio', () => {
      const prods = obtenerProductos();
      expect(prods.length).toBe(PRODUCTOS.length);
    });

    it('permite guardar un producto nuevo y recuperarlo', () => {
      const nuevo = { codigo: 'TEST01', nombre: 'Test', precio: 50000, categoria: 'Accesorios' };
      guardarProducto(nuevo);
      const lista = obtenerProductos();
      expect(lista[0].codigo).toBe('TEST01');
      expect(obtenerProductoPorCodigo('TEST01')).toBeTruthy();
    });

    it('permite actualizar un producto existente', () => {
      actualizarProducto('GA001', { precio: 99999 });
      const prod = obtenerProductoPorCodigo('GA001');
      expect(prod.precio).toBe(99999);
    });

    it('permite eliminar un producto por codigo', () => {
      eliminarProducto('GA001');
      expect(obtenerProductoPorCodigo('GA001')).toBeNull();
    });
  });

  describe('CRUD de usuarios y sesion con localStorage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('inicializa usuarios si localStorage esta vacio', () => {
      const usrs = obtenerUsuarios();
      expect(usrs.length).toBeGreaterThan(0);
    });

    it('permite guardar y obtener usuario por run', () => {
      const nuevoUsr = { run: '112223334', nombre: 'Prueba', correo: 'prueba@duoc.cl' };
      guardarUsuario(nuevoUsr);
      expect(obtenerUsuarioPorRun('112223334')).toBeTruthy();
      expect(obtenerUsuarioPorRun('11.222.333-4')).toBeTruthy();
    });

    it('permite actualizar datos de usuario', () => {
      actualizarUsuario('190110222', { nombre: 'Carla Editada' });
      const usr = obtenerUsuarioPorRun('190110222');
      expect(usr.nombre).toBe('Carla Editada');
    });

    it('permite eliminar usuario por run', () => {
      eliminarUsuario('190110222');
      expect(obtenerUsuarioPorRun('190110222')).toBeNull();
    });

    it('maneja la sesion del usuario activo', () => {
      expect(obtenerUsuarioActivo()).toBeNull();
      guardarUsuarioActivo({ correo: 'test@duoc.cl', nombre: 'Test' });
      expect(obtenerUsuarioActivo().correo).toBe('test@duoc.cl');
      cerrarSesion();
      expect(obtenerUsuarioActivo()).toBeNull();
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