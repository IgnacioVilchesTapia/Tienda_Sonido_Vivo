import { useState, useEffect } from 'react';

/**
 * Custom Hook para consumo de endpoints REST (preparado para Spring Boot)
 * @param {string} url - Ruta o endpoint de la API
 * @param {RequestInit} [options] - Opciones de fetch (headers, method, etc.)
 */
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    setLoading(true);

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error en la petición: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((resultado) => {
        if (isMounted) {
          setData(resultado);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error desconocido al obtener datos');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
