import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'sonidoVivo.carrito';
const CUPON_KEY = 'sonidoVivo.cupon';

const CUPONES_VALIDOS = {
  'SONIDOVIVO10': 10,
  'MUSICO5': 5
};

export function CartProvider({ children }) {
  // Inicializar carrito desde localStorage
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  // Inicializar cupón activo
  const [cupon, setCupon] = useState(() => {
    try {
      return localStorage.getItem(CUPON_KEY) || '';
    } catch {
      return '';
    }
  });

  // Guardar en localStorage ante cambios
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error guardando carrito en localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (cupon) {
        localStorage.setItem(CUPON_KEY, cupon);
      } else {
        localStorage.removeItem(CUPON_KEY);
      }
    } catch (e) {
      console.error('Error guardando cupón', e);
    }
  }, [cupon]);

  // Regla 1 & 2: Agregar producto validando stock
  const agregarAlCarrito = (producto, cantidad = 1) => {
    if (!producto || !producto.codigo) return { ok: false, mensaje: 'Producto inválido' };

    const existente = items.find((it) => it.codigo === producto.codigo);
    const cantidadActual = existente ? existente.cantidad : 0;
    const nuevaCantidad = cantidadActual + cantidad;

    if (nuevaCantidad > producto.stock) {
      return {
        ok: false,
        mensaje: `No puedes agregar más de ${producto.stock} unidades. Ya tienes ${cantidadActual} en el carrito.`
      };
    }

    if (existente) {
      setItems(items.map((it) =>
        it.codigo === producto.codigo ? { ...it, cantidad: nuevaCantidad } : it
      ));
    } else {
      setItems([...items, { ...producto, cantidad }]);
    }

    return {
      ok: true,
      mensaje: `¡"${producto.nombre}" agregado al carrito!`
    };
  };

  // Regla 3: Modificar cantidad respetando stock y mínimo 1
  const actualizarCantidad = (codigo, nuevaCantidad) => {
    const cant = parseInt(nuevaCantidad, 10);
    if (isNaN(cant) || cant <= 0) {
      eliminarDelCarrito(codigo);
      return;
    }

    setItems(items.map((it) => {
      if (it.codigo === codigo) {
        const cantidadSegura = Math.min(cant, it.stock || cant);
        return { ...it, cantidad: cantidadSegura };
      }
      return it;
    }));
  };

  // Eliminar producto
  const eliminarDelCarrito = (codigo) => {
    setItems(items.filter((it) => it.codigo !== codigo));
  };

  // Vaciar carrito
  const vaciarCarrito = () => {
    setItems([]);
    setCupon('');
  };

  // Regla 4: Cupones de descuento
  const aplicarCupon = (codigoCupon) => {
    const normalizado = (codigoCupon || '').trim().toUpperCase();
    if (CUPONES_VALIDOS[normalizado]) {
      setCupon(normalizado);
      return { ok: true, mensaje: `Cupón ${normalizado} aplicado: ${CUPONES_VALIDOS[normalizado]}% de descuento.` };
    }
    return { ok: false, mensaje: 'El cupón ingresado no es válido o ha expirado.' };
  };

  const quitarCupon = () => {
    setCupon('');
  };

  // Cálculos totales
  const cantidadTotal = items.reduce((acc, it) => acc + it.cantidad, 0);
  const subtotal = items.reduce((acc, it) => acc + (it.precio * it.cantidad), 0);
  const porcentajeDescuento = CUPONES_VALIDOS[cupon] || 0;
  const descuento = Math.round(subtotal * (porcentajeDescuento / 100));
  
  // Regla 5: Despacho $4.990; gratuito sobre $150.000
  const costoDespacho = (subtotal > 150000 || items.length === 0) ? 0 : 4990;
  const total = Math.max(0, subtotal - descuento + costoDespacho);

  const valor = {
    items,
    cupon,
    porcentajeDescuento,
    cantidadTotal,
    subtotal,
    descuento,
    costoDespacho,
    total,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    aplicarCupon,
    quitarCupon
  };

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
}
