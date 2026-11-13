import { useState, useEffect, useCallback } from 'react';
import { listarProductos } from '../services/productoService';
import { listarCategorias } from '../services/categoriaService';
import { obtenerProductos as obtenerProductosLocales, obtenerCategorias as obtenerCategoriasLocales } from '../data/datos';

export function useCatalogo(filtros = {}) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        listarProductos(filtros),
        listarCategorias()
      ]);
      setProductos(prods);
      setCategorias(cats);
    } catch (err) {
      setError(err);
      setProductos(obtenerProductosLocales());
      setCategorias(obtenerCategoriasLocales().map((nombre, i) => ({ id: i + 1, nombre })));
    } finally {
      setCargando(false);
    }
  }, [filtros.categoria, filtros.q]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { productos, categorias, cargando, error, recargar: cargar };
}

export default useCatalogo;
