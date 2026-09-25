// carrito.js — carrito de compras persistido en localStorage.
//
// Reglas de negocio definidas por el equipo (el enunciado pide investigarlas
// y dejarlas documentadas):
//   1. Un producto no se puede agregar más veces que su stock disponible.
//   2. Si el producto ya está en el carrito, se suma la cantidad en la misma línea.
//   3. Cantidad mínima 1: bajar de 1 elimina la línea.
//   4. Cupón SONIDOVIVO10 descuenta 10% sobre el subtotal. Uno por compra.
//   5. Despacho gratis desde $150.000; bajo ese monto, $4.990.
//   6. Los precios del catálogo ya incluyen IVA.

const CLAVE_CARRITO = "sonidoVivo.carrito";
const CUPONES = { SONIDOVIVO10: 0.10, MUSICO5: 0.05 };
const DESPACHO = 4990;
const MINIMO_DESPACHO_GRATIS = 150000;

// Respaldo en memoria: algunos navegadores bloquean localStorage al abrir el
// sitio con doble clic (protocolo file://) o en modo privado. En ese caso el
// carrito sigue funcionando durante la sesión en vez de romper la página.
let carritoEnMemoria = [];

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch (error) {
    console.warn("localStorage no disponible, se usa el carrito en memoria.", error);
    return carritoEnMemoria;
  }
}

function guardarCarrito(carrito) {
  carritoEnMemoria = carrito;
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (error) {
    console.warn("No se pudo guardar el carrito en localStorage.", error);
  }
  actualizarContador();
}

function actualizarContador() {
  const total = leerCarrito().reduce(function (suma, linea) { return suma + linea.cantidad; }, 0);
  document.querySelectorAll(".contador-carrito").forEach(function (nodo) {
    nodo.textContent = total;
  });
}

function buscarProducto(codigo) {
  return PRODUCTOS.find(function (p) { return p.codigo === codigo; });
}

/** Agrega un producto respetando el stock disponible. Devuelve un mensaje para el usuario. */
/** Normaliza una cantidad: entero, mínimo 1. Descarta texto, decimales y negativos. */
function normalizarCantidad(valor, porDefecto) {
  const numero = Math.floor(Number(valor));
  if (!Number.isFinite(numero) || numero < 1) return porDefecto;
  return numero;
}

function agregarAlCarrito(codigo, cantidad) {
  cantidad = normalizarCantidad(cantidad, 1);
  const producto = buscarProducto(codigo);
  if (!producto) return { ok: false, texto: "No encontramos ese producto en el catálogo." };
  if (producto.stock === 0) return { ok: false, texto: "Sin stock por ahora. Escríbenos por Contacto y te avisamos cuando llegue." };

  const carrito = leerCarrito();
  const linea = carrito.find(function (l) { return l.codigo === codigo; });
  const enCarrito = linea ? linea.cantidad : 0;

  if (enCarrito + cantidad > producto.stock) {
    return {
      ok: false,
      texto: "Solo quedan " + producto.stock + " unidades de " + producto.nombre + " y ya tienes " + enCarrito + " en el carrito."
    };
  }

  if (linea) {
    linea.cantidad += cantidad;
  } else {
    carrito.push({ codigo: codigo, cantidad: cantidad });
  }
  guardarCarrito(carrito);
  return { ok: true, texto: producto.nombre + " se agregó al carrito." };
}

function cambiarCantidad(codigo, nuevaCantidad) {
  const producto = buscarProducto(codigo);
  let carrito = leerCarrito();

  // El producto podría haber salido del catálogo desde la última visita.
  if (!producto) {
    guardarCarrito(carrito.filter(function (l) { return l.codigo !== codigo; }));
    dibujarCarrito();
    return;
  }

  const texto = String(nuevaCantidad).trim();
  const numero = Math.floor(Number(texto));

  // Campo vacío o texto no numérico: no se toca el carrito, solo se redibuja
  // para devolver el input a su valor anterior.
  if (texto === "" || !Number.isFinite(numero)) {
    dibujarCarrito();
    return;
  }

  if (numero < 1) {
    carrito = carrito.filter(function (l) { return l.codigo !== codigo; });
  } else {
    const linea = carrito.find(function (l) { return l.codigo === codigo; });
    if (linea) linea.cantidad = Math.min(numero, producto.stock);
  }
  guardarCarrito(carrito);
  dibujarCarrito();
}

function eliminarDelCarrito(codigo) {
  guardarCarrito(leerCarrito().filter(function (l) { return l.codigo !== codigo; }));
  dibujarCarrito();
}

function vaciarCarrito() {
  guardarCarrito([]);
  dibujarCarrito();
}

function calcularTotales(descuento) {
  const subtotal = leerCarrito().reduce(function (suma, linea) {
    const producto = buscarProducto(linea.codigo);
    return suma + (producto ? producto.precio * linea.cantidad : 0);
  }, 0);
  const rebaja = Math.round(subtotal * (descuento || 0));
  const base = subtotal - rebaja;
  const envio = base === 0 || base >= MINIMO_DESPACHO_GRATIS ? 0 : DESPACHO;
  return { subtotal: subtotal, rebaja: rebaja, envio: envio, total: base + envio };
}

/* ---------- Dibujo de la página carrito.html ---------- */
// El cupón se guarda en sessionStorage: si el cliente vuelve al catálogo a
// agregar otro producto, al regresar el descuento sigue aplicado.
const CLAVE_CUPON = "sonidoVivo.cupon";

function leerCupon() {
  try {
    return sessionStorage.getItem(CLAVE_CUPON) || "";
  } catch (error) {
    return "";
  }
}

function guardarCupon(codigo) {
  try {
    if (codigo) sessionStorage.setItem(CLAVE_CUPON, codigo);
    else sessionStorage.removeItem(CLAVE_CUPON);
  } catch (error) {
    console.warn("No se pudo guardar el cupón.", error);
  }
}

function descuentoVigente() {
  return CUPONES[leerCupon()] || 0;
}

function dibujarCarrito() {
  const contenedor = document.getElementById("lineas-carrito");
  if (!contenedor) return;

  const carrito = leerCarrito();
  const resumen = document.getElementById("resumen-carrito");

  if (carrito.length === 0) {
    contenedor.innerHTML =
      '<p class="vacio">Tu carrito está vacío. Mira el <a href="productos.html">catálogo</a> y agrega tu primer instrumento.</p>';
    if (resumen) resumen.hidden = true;
    return;
  }
  if (resumen) resumen.hidden = false;

  contenedor.innerHTML = carrito.map(function (linea) {
    const p = buscarProducto(linea.codigo);
    if (!p) return "";
    return '' +
      '<article class="linea-carrito">' +
        '<img src="' + p.imagen + '" alt="' + escaparHtml(p.nombre) + '" width="110" height="70">' +
        '<div>' +
          '<p class="linea-carrito__nombre">' + escaparHtml(p.nombre) + '</p>' +
          '<p class="linea-carrito__meta">' + escaparHtml(p.marca + ' ' + p.modelo) + ' · ' + formatearPrecio(p.precio) + ' c/u</p>' +
          '<div class="control-cantidad">' +
            '<button type="button" aria-label="Quitar una unidad" data-accion="menos" data-codigo="' + p.codigo + '">−</button>' +
            '<input type="number" min="1" max="' + p.stock + '" value="' + linea.cantidad + '" aria-label="Cantidad de ' + escaparHtml(p.nombre) + '" data-accion="cantidad" data-codigo="' + p.codigo + '">' +
            '<button type="button" aria-label="Agregar una unidad" data-accion="mas" data-codigo="' + p.codigo + '">+</button>' +
            '<button type="button" class="boton boton--linea" data-accion="eliminar" data-codigo="' + p.codigo + '">Quitar</button>' +
          '</div>' +
        '</div>' +
        '<p class="linea-carrito__nombre">' + formatearPrecio(p.precio * linea.cantidad) + '</p>' +
      '</article>';
  }).join("");

  const t = calcularTotales(descuentoVigente());
  document.getElementById("subtotal").textContent = formatearPrecio(t.subtotal);
  document.getElementById("descuento").textContent = "-" + formatearPrecio(t.rebaja);
  document.getElementById("envio").textContent = t.envio === 0 ? "Gratis" : formatearPrecio(t.envio);
  document.getElementById("total").textContent = formatearPrecio(t.total);
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarContador();
  dibujarCarrito();

  // Botones "Agregar" repartidos por el sitio (delegación de eventos)
  document.addEventListener("click", function (evento) {
    const boton = evento.target.closest("[data-agregar]");
    if (!boton) return;
    const cantidadInput = document.getElementById("cantidad");
    const cantidad = cantidadInput ? Number(cantidadInput.value) : 1;
    const resultado = agregarAlCarrito(boton.dataset.agregar, cantidad);

    const aviso = document.getElementById("aviso-carrito");
    if (aviso) {
      aviso.textContent = resultado.texto;
      aviso.className = "mensaje mensaje--" + (resultado.ok ? "ok" : "error");
      aviso.hidden = false;
    }
  });

  // Controles dentro de la página del carrito
  const contenedor = document.getElementById("lineas-carrito");
  if (contenedor) {
    contenedor.addEventListener("click", function (evento) {
      const boton = evento.target.closest("button[data-accion]");
      if (!boton) return;
      const codigo = boton.dataset.codigo;
      const actual = leerCarrito().find(function (l) { return l.codigo === codigo; });
      if (boton.dataset.accion === "mas") cambiarCantidad(codigo, actual.cantidad + 1);
      if (boton.dataset.accion === "menos") cambiarCantidad(codigo, actual.cantidad - 1);
      if (boton.dataset.accion === "eliminar") eliminarDelCarrito(codigo);
    });
    contenedor.addEventListener("change", function (evento) {
      if (evento.target.dataset.accion === "cantidad") {
        cambiarCantidad(evento.target.dataset.codigo, evento.target.value);
      }
    });
  }

  const btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) btnVaciar.addEventListener("click", vaciarCarrito);

  // Cupón de descuento
  const formCupon = document.getElementById("form-cupon");
  if (formCupon) {
    formCupon.addEventListener("submit", function (evento) {
      evento.preventDefault();
      const codigo = document.getElementById("cupon").value.trim().toUpperCase();
      const aviso = document.getElementById("aviso-cupon");
      if (CUPONES[codigo]) {
        guardarCupon(codigo);
        aviso.className = "mensaje mensaje--ok";
        aviso.textContent = "Cupón aplicado: " + (CUPONES[codigo] * 100) + "% de descuento.";
      } else {
        guardarCupon("");
        aviso.className = "mensaje mensaje--error";
        aviso.textContent = "Ese cupón no existe o ya venció.";
      }
      aviso.hidden = false;
      dibujarCarrito();
    });
  }

  const btnPagar = document.getElementById("pagar");
  if (btnPagar) {
    btnPagar.addEventListener("click", function () {
      const aviso = document.getElementById("aviso-pedido");
      const vacio = leerCarrito().length === 0;
      aviso.className = "mensaje mensaje--" + (vacio ? "error" : "ok");
      aviso.hidden = false;
      aviso.textContent = vacio
        ? "Tu carrito está vacío. Agrega al menos un producto antes de confirmar."
        : "Pedido listo para confirmar. El pago y el seguimiento se implementan en la entrega 2 con la API de pedidos.";
    });
  }

  // Si el cliente tiene dos pestañas abiertas, el carrito se mantiene igual
  // en ambas: escuchamos el evento que dispara el navegador al cambiar
  // localStorage desde otra pestaña.
  window.addEventListener("storage", function (evento) {
    if (evento.key === CLAVE_CARRITO) {
      actualizarContador();
      dibujarCarrito();
    }
  });

  // Restaurar el cupón guardado al volver a la página
  const inputCupon = document.getElementById("cupon");
  if (inputCupon && leerCupon()) {
    inputCupon.value = leerCupon();
    const aviso = document.getElementById("aviso-cupon");
    aviso.className = "mensaje mensaje--ok";
    aviso.hidden = false;
    aviso.textContent = "Cupón aplicado: " + (descuentoVigente() * 100) + "% de descuento.";
    dibujarCarrito();
  }
});
