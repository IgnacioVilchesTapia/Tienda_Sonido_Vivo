import { useState, useEffect } from 'react';
import { listarProductos } from '../services/productoService';
import { listarCategorias } from '../services/categoriaService';
import { obtenerProductos as obtenerProductosLocales, obtenerCategorias as obtenerCategoriasLocales } from '../data/datos';

async function obtenerCatalogo(filtros) {
  try {
    const [productos, categorias] = await Promise.all([
      listarProductos(filtros),
      listarCategorias()
    ]);
    return { productos, categorias, error: null };
  } catch (err) {
    return {
      productos: obtenerProductosLocales(),
      categorias: obtenerCategoriasLocales().map((nombre, i) => ({ id: i + 1, nombre })),
      error: err
    };
  }
}

export function useCatalogo(filtros = {}) {
  const { categoria, q } = filtros;
  const [catalogo, setCatalogo] = useState({ productos: [], categorias: [], cargando: true, error: null });

  useEffect(() => {
    let activo = true;

    obtenerCatalogo({ categoria, q }).then((datos) => {
      if (activo) {
        setCatalogo({ ...datos, cargando: false });
      }
    });

    return () => {
      activo = false;
    };
  }, [categoria, q]);

  return catalogo;
}

export default useCatalogo;
