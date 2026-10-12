import { useState, useEffect } from 'react';

export function useFetch(url, options = {}) {
  const [respuesta, setRespuesta] = useState({ url: null, data: null, error: null });

  useEffect(() => {
    if (!url) return;

    let activo = true;

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error en la petición: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((resultado) => {
        if (activo) {
          setRespuesta({ url: url, data: resultado, error: null });
        }
      })
      .catch((err) => {
        if (activo) {
          setRespuesta({ url: url, data: null, error: err.message || 'Error desconocido al obtener datos' });
        }
      });

    return () => {
      activo = false;
    };
  }, [url]);

  const loading = !!url && respuesta.url !== url;

  return { data: respuesta.data, loading: loading, error: respuesta.error };
}
export default useFetch;
