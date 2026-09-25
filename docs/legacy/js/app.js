
function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapa los caracteres que el navegador interpretaría como HTML.
 * Todo dato que se inserte con innerHTML pasa por aquí: hoy el catálogo es
 * un arreglo local, pero cuando venga de la API un nombre con < o > podría
 * inyectar etiquetas en la página (XSS).
 */
function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Formatea un número como precio chileno: 129990 -> $129.990 */
function formatearPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}

/** Devuelve el valor de un parámetro de la URL (?codigo=GA001). */
function parametroUrl(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

/** Ruta base: las páginas de /admin/ necesitan subir un nivel para las imágenes. */
function rutaBase() {
  return window.location.pathname.includes("/admin/") ? "../" : "";
}

document.addEventListener("DOMContentLoaded", function () {
  // Menú hamburguesa (solo visible bajo 768 px)
  const boton = document.querySelector(".boton-menu");
  const nav = document.querySelector(".nav-principal");
  if (boton && nav) {
    boton.addEventListener("click", function () {
      const abierto = nav.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
      boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
  }

  // Año actual en el pie de página
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  // Formulario de suscripción del pie: validación mínima en su propio contexto
  const suscripcion = document.getElementById("form-suscripcion");
  if (suscripcion) {
    suscripcion.addEventListener("submit", function (evento) {
      evento.preventDefault();
      const correo = suscripcion.querySelector("input[type='email']");
      const aviso = suscripcion.querySelector(".error");
      const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
      aviso.textContent = valido ? "" : "Escribe un correo válido para suscribirte.";
      aviso.style.display = valido ? "none" : "block";
      if (valido) {
        correo.value = "";
        aviso.style.display = "block";
        aviso.style.color = "var(--ok)";
        aviso.textContent = "Listo, quedaste suscrito al boletín.";
      }
    });
  }
});
