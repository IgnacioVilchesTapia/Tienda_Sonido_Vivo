

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

// El enunciado pide "validar si el RUN está correcto", así que además del
// formato comprobamos el dígito verificador con módulo 11.
// Ojo: el RUN 19011022K que aparece como ejemplo en el enunciado es solo un
// ejemplo de FORMATO y no pasa el módulo 11. Si el docente prueba con ese
// número, cambia esta constante a false para validar únicamente el formato.
const VALIDAR_DIGITO_VERIFICADOR = true;

/* ============================================================
   1. Utilidades de presentación de errores
   ============================================================ */

function contenedorCampo(input) {
  return input.closest(".campo") || input.parentElement;
}

function mostrarError(input, mensaje) {
  const campo = contenedorCampo(input);
  campo.classList.add("campo--error");
  campo.classList.remove("campo--ok");
  const error = campo.querySelector(".error");
  if (error) error.textContent = mensaje;
  input.setAttribute("aria-invalid", "true");
  return false;
}

function marcarValido(input) {
  const campo = contenedorCampo(input);
  campo.classList.remove("campo--error");
  if (input.value.trim() !== "") campo.classList.add("campo--ok");
  input.removeAttribute("aria-invalid");
  return true;
}

function mostrarAviso(idFormulario, texto, tipo) {
  const aviso = document.querySelector("#" + idFormulario + " .mensaje");
  if (!aviso) return;
  aviso.textContent = texto;
  aviso.className = "mensaje mensaje--" + (tipo || "ok");
  aviso.hidden = false;
  aviso.focus && aviso.focus();
}

/* ============================================================
   2. Validadores reutilizables
   Cada uno devuelve true/false y deja el mensaje en pantalla.
   ============================================================ */

function validarRequerido(input, etiqueta) {
  if (input.value.trim() === "") {
    return mostrarError(input, "Ingresa " + etiqueta + ". Este dato es obligatorio.");
  }
  return marcarValido(input);
}

function validarLargo(input, min, max, etiqueta) {
  const largo = input.value.trim().length;
  if (min && largo < min) {
    return mostrarError(input, etiqueta + " debe tener al menos " + min + " caracteres. Llevas " + largo + ".");
  }
  if (max && largo > max) {
    return mostrarError(input, etiqueta + " no puede superar los " + max + " caracteres. Llevas " + largo + ".");
  }
  return marcarValido(input);
}

function validarCorreo(input, requerido) {
  const valor = input.value.trim().toLowerCase();
  if (valor === "") {
    return requerido
      ? mostrarError(input, "Ingresa tu correo. Este dato es obligatorio.")
      : marcarValido(input);
  }
  if (valor.length > 100) {
    return mostrarError(input, "El correo no puede superar los 100 caracteres.");
  }
  // El formato se revisa antes que el dominio: si el usuario escribió "hola",
  // el problema es el formato, no el dominio.
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  if (!formatoValido) {
    return mostrarError(input, "El correo no tiene un formato válido. Ejemplo: nombre@duoc.cl");
  }
  const dominioValido = DOMINIOS_PERMITIDOS.some(function (d) { return valor.endsWith(d); });
  if (!dominioValido) {
    return mostrarError(input, "Usa un correo terminado en " + DOMINIOS_PERMITIDOS.join(", ") + ".");
  }
  return marcarValido(input);
}

function validarClave(input) {
  const valor = input.value;
  if (valor === "") {
    return mostrarError(input, "Ingresa tu contraseña. Este dato es obligatorio.");
  }
  if (valor.length < 4 || valor.length > 10) {
    return mostrarError(input, "La contraseña debe tener entre 4 y 10 caracteres. Llevas " + valor.length + ".");
  }
  return marcarValido(input);
}

/**
 * Valida el RUN chileno sin puntos ni guion (ej: 19011022K).
 * Comprueba largo (7 a 9) y dígito verificador con módulo 11.
 */
function digitoVerificador(cuerpo) {
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

/** Quita puntos y guion y pasa a mayúsculas. Se llama solo al salir del campo
 *  para no mover el cursor mientras el usuario escribe. */
function normalizarRun(input) {
  input.value = input.value.trim().toUpperCase().replace(/[.\-]/g, "");
}

function validarRun(input) {
  const valor = input.value.trim().toUpperCase().replace(/[.\-]/g, "");
  if (valor === "") {
    return mostrarError(input, "Ingresa el RUN. Este dato es obligatorio.");
  }
  if (valor.length < 7 || valor.length > 9) {
    return mostrarError(input, "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion. Ejemplo: 19011022K");
  }
  if (!/^[0-9]+[0-9K]$/.test(valor)) {
    return mostrarError(input, "El RUN solo admite números y una K final. Ejemplo: 19011022K");
  }
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);
  if (parseInt(cuerpo, 10) <= 0) {
    return mostrarError(input, "El RUN no puede ser cero. Revisa el número.");
  }
  if (VALIDAR_DIGITO_VERIFICADOR && digitoVerificador(cuerpo) !== dv) {
    return mostrarError(input, "El RUN no es válido: el dígito verificador no corresponde.");
  }
  return marcarValido(input);
}

function validarNumero(input, opciones) {
  const o = opciones || {};
  // Un <input type="number"> devuelve "" cuando el navegador no puede
  // interpretar lo escrito (por ejemplo "1e--"). Sin esta comprobación un
  // campo con basura se tomaría como campo vacío.
  if (input.validity && input.validity.badInput) {
    return mostrarError(input, o.etiqueta + " tiene caracteres que no son un número válido.");
  }
  const texto = input.value.trim();
  if (texto === "") {
    return o.requerido
      ? mostrarError(input, "Ingresa " + o.etiqueta + ". Este dato es obligatorio.")
      : marcarValido(input);
  }
  const valor = Number(texto);
  if (isNaN(valor)) {
    return mostrarError(input, o.etiqueta + " debe ser un número.");
  }
  if (o.entero && !Number.isInteger(valor)) {
    return mostrarError(input, o.etiqueta + " debe ser un número entero, sin decimales.");
  }
  if (o.min !== undefined && valor < o.min) {
    return mostrarError(input, o.etiqueta + " no puede ser menor que " + o.min + ".");
  }
  if (o.max !== undefined && valor > o.max) {
    return mostrarError(input, o.etiqueta + " no puede ser mayor que " + o.max + ".");
  }
  return marcarValido(input);
}

/** La fecha es opcional, pero si se escribe no puede estar en el futuro
 *  ni corresponder a una edad imposible. */
function validarNacimiento(input) {
  if (!input || input.value === "") return marcarValido(input);
  const fecha = new Date(input.value + "T00:00:00");
  if (isNaN(fecha.getTime())) {
    return mostrarError(input, "La fecha de nacimiento no es válida.");
  }
  const hoy = new Date();
  if (fecha > hoy) {
    return mostrarError(input, "La fecha de nacimiento no puede estar en el futuro.");
  }
  const edad = (hoy - fecha) / (1000 * 60 * 60 * 24 * 365.25);
  if (edad > 120) {
    return mostrarError(input, "Revisa el año: la fecha corresponde a una edad imposible.");
  }
  if (edad < 13) {
    return mostrarError(input, "Debes tener al menos 13 años para registrarte.");
  }
  return marcarValido(input);
}

function validarSeleccion(input, etiqueta) {
  if (input.value === "") {
    return mostrarError(input, "Selecciona " + etiqueta + ".");
  }
  return marcarValido(input);
}

function validarConfirmacion(input, original, etiqueta) {
  if (input.value === "") {
    return mostrarError(input, "Repite " + etiqueta + " para confirmar.");
  }
  if (input.value !== original.value) {
    return mostrarError(input, "Los valores no coinciden. Revisa " + etiqueta + ".");
  }
  return marcarValido(input);
}

/* Ejecuta un conjunto de validaciones y devuelve true solo si todas pasan.
   No se corta en la primera: así el usuario ve todos los errores de una vez. */
function todasValidas(validaciones) {
  return validaciones.map(function (fn) { return fn(); }).every(Boolean);
}

/* Registra la validación en vivo: al salir del campo y al corregir un campo
   que ya estaba marcado en rojo. */
function enVivo(input, fn) {
  if (!input) return;
  input.addEventListener("blur", fn);
  input.addEventListener("input", function () {
    if (contenedorCampo(input).classList.contains("campo--error")) fn();
  });
}

/* ============================================================
   3. Formularios concretos
   ============================================================ */

function iniciarFormularioLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;
  const correo = document.getElementById("correo");
  const clave = document.getElementById("clave");

  enVivo(correo, function () { validarCorreo(correo, true); });
  enVivo(clave, function () { validarClave(clave); });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const ok = todasValidas([
      function () { return validarCorreo(correo, true); },
      function () { return validarClave(clave); }
    ]);
    if (ok) {
      mostrarAviso("form-login", "Datos correctos. En la entrega 1 no hay backend todavía: aquí se llamará al servicio de autenticación.", "ok");
    } else {
      mostrarAviso("form-login", "Revisa los campos marcados en rojo para continuar.", "error");
    }
  });
}

function iniciarFormularioContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;
  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const comentario = document.getElementById("comentario");
  const contador = document.getElementById("contador-comentario");

  enVivo(nombre, function () { return validarRequerido(nombre, "tu nombre") && validarLargo(nombre, 0, 100, "El nombre"); });
  enVivo(correo, function () { validarCorreo(correo, false); });
  enVivo(comentario, function () { return validarRequerido(comentario, "tu mensaje") && validarLargo(comentario, 0, 500, "El mensaje"); });

  if (contador) {
    comentario.addEventListener("input", function () {
      contador.textContent = comentario.value.length + " / 500 caracteres";
    });
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const ok = todasValidas([
      function () { return validarRequerido(nombre, "tu nombre") && validarLargo(nombre, 0, 100, "El nombre"); },
      function () { return validarCorreo(correo, false); },
      function () { return validarRequerido(comentario, "tu mensaje") && validarLargo(comentario, 0, 500, "El mensaje"); }
    ]);
    if (ok) {
      mostrarAviso("form-contacto", "Mensaje listo para enviar. Te responderemos al correo indicado.", "ok");
      form.reset();
      if (contador) contador.textContent = "0 / 500 caracteres";
      document.querySelectorAll("#form-contacto .campo--ok").forEach(function (c) { c.classList.remove("campo--ok"); });
    } else {
      mostrarAviso("form-contacto", "Faltan datos o hay errores. Revisa los campos marcados.", "error");
    }
  });
}

/* Registro público y "nuevo usuario" del administrador comparten reglas.
   El enunciado dice que son el mismo formulario, así que es la misma función. */
function iniciarFormularioUsuario(idFormulario) {
  const form = document.getElementById(idFormulario);
  if (!form) return;

  const run = document.getElementById("run");
  const nombre = document.getElementById("nombre");
  const apellidos = document.getElementById("apellidos");
  const correo = document.getElementById("correo");
  const clave = document.getElementById("clave");
  const clave2 = document.getElementById("clave2");
  const nacimiento = document.getElementById("nacimiento");
  const tipo = document.getElementById("tipo");
  const region = document.getElementById("region");
  const comuna = document.getElementById("comuna");
  const direccion = document.getElementById("direccion");

  conectarRegionComuna("region", "comuna", form.dataset.comuna);

  run.addEventListener("blur", function () { normalizarRun(run); });
  enVivo(run, function () { validarRun(run); });
  enVivo(nacimiento, function () { validarNacimiento(nacimiento); });
  enVivo(nombre, function () { return validarRequerido(nombre, "el nombre") && validarLargo(nombre, 0, 50, "El nombre"); });
  enVivo(apellidos, function () { return validarRequerido(apellidos, "los apellidos") && validarLargo(apellidos, 0, 100, "Los apellidos"); });
  enVivo(correo, function () { validarCorreo(correo, true); });
  enVivo(direccion, function () { return validarRequerido(direccion, "la dirección") && validarLargo(direccion, 0, 300, "La dirección"); });
  // Al cambiar la contraseña se revalida también la confirmación: si no,
  // clave2 seguiría marcada en verde con un valor que ya no coincide.
  if (clave) enVivo(clave, function () {
    validarClave(clave);
    if (clave2 && clave2.value !== "") validarConfirmacion(clave2, clave, "la contraseña");
  });
  if (clave2) enVivo(clave2, function () { validarConfirmacion(clave2, clave, "la contraseña"); });
  if (tipo) enVivo(tipo, function () { validarSeleccion(tipo, "el tipo de usuario"); });
  enVivo(region, function () { validarSeleccion(region, "una región"); });
  enVivo(comuna, function () { validarSeleccion(comuna, "una comuna"); });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const reglas = [
      function () { return validarRun(run); },
      function () { return validarRequerido(nombre, "el nombre") && validarLargo(nombre, 0, 50, "El nombre"); },
      function () { return validarRequerido(apellidos, "los apellidos") && validarLargo(apellidos, 0, 100, "Los apellidos"); },
      function () { return validarCorreo(correo, true); },
      function () { return validarSeleccion(region, "una región"); },
      function () { return validarSeleccion(comuna, "una comuna"); },
      function () { return validarRequerido(direccion, "la dirección") && validarLargo(direccion, 0, 300, "La dirección"); },
      function () { return validarNacimiento(nacimiento); }
    ];
    if (clave) reglas.push(function () { return validarClave(clave); });
    if (clave2) reglas.push(function () { return validarConfirmacion(clave2, clave, "la contraseña"); });
    if (tipo) reglas.push(function () { return validarSeleccion(tipo, "el tipo de usuario"); });

    if (todasValidas(reglas)) {
      mostrarAviso(idFormulario, "Usuario válido. Los datos quedarían guardados al conectar la API en la entrega 2.", "ok");
    } else {
      mostrarAviso(idFormulario, "Hay campos con errores. Corrígelos antes de guardar.", "error");
    }
  });
}

function iniciarFormularioProducto(idFormulario) {
  const form = document.getElementById(idFormulario);
  if (!form) return;

  const codigo = document.getElementById("codigo");
  const nombre = document.getElementById("nombre");
  const descripcion = document.getElementById("descripcion");
  const precio = document.getElementById("precio");
  const stock = document.getElementById("stock");
  const critico = document.getElementById("stock-critico");
  const categoria = document.getElementById("categoria");

  // El select de categorías se llena desde el mismo arreglo del catálogo
  if (categoria && typeof CATEGORIAS !== "undefined" && categoria.options.length <= 1) {
    CATEGORIAS.forEach(function (c) {
      const opcion = document.createElement("option");
      opcion.value = c;
      opcion.textContent = c;
      categoria.appendChild(opcion);
    });
    if (form.dataset.categoria) categoria.value = form.dataset.categoria;
  }

  enVivo(codigo, function () { return validarRequerido(codigo, "el código del producto") && validarLargo(codigo, 3, 0, "El código"); });
  enVivo(nombre, function () { return validarRequerido(nombre, "el nombre del producto") && validarLargo(nombre, 0, 100, "El nombre"); });
  enVivo(descripcion, function () { return validarLargo(descripcion, 0, 500, "La descripción"); });
  enVivo(precio, function () { return validarNumero(precio, { requerido: true, min: 0, etiqueta: "El precio" }); });
  enVivo(stock, function () { return validarNumero(stock, { requerido: true, min: 0, entero: true, etiqueta: "El stock" }); });
  enVivo(critico, function () { return validarNumero(critico, { requerido: false, min: 0, entero: true, etiqueta: "El stock crítico" }); });
  enVivo(categoria, function () { return validarSeleccion(categoria, "una categoría"); });

  // Sugerencia dinámica: avisa cuando el producto quedaría bajo el umbral crítico
  function revisarStockCritico() {
    const aviso = document.getElementById("aviso-critico");
    if (!aviso) return;
    const s = Number(stock.value);
    const c = Number(critico.value);
    const aplica = stock.value !== "" && critico.value !== "" && s <= c;
    aviso.hidden = !aplica;
    if (aplica) aviso.textContent = "Con " + s + " unidades quedarías en o bajo el stock crítico (" + c + "). Se mostrará alerta en el panel.";
  }
  if (stock) stock.addEventListener("input", revisarStockCritico);
  if (critico) critico.addEventListener("input", revisarStockCritico);

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const ok = todasValidas([
      function () { return validarRequerido(codigo, "el código del producto") && validarLargo(codigo, 3, 0, "El código"); },
      function () { return validarRequerido(nombre, "el nombre del producto") && validarLargo(nombre, 0, 100, "El nombre"); },
      function () { return validarLargo(descripcion, 0, 500, "La descripción"); },
      function () { return validarNumero(precio, { requerido: true, min: 0, etiqueta: "El precio" }); },
      function () { return validarNumero(stock, { requerido: true, min: 0, entero: true, etiqueta: "El stock" }); },
      function () { return validarNumero(critico, { requerido: false, min: 0, entero: true, etiqueta: "El stock crítico" }); },
      function () { return validarSeleccion(categoria, "una categoría"); }
    ]);
    if (ok) {
      const gratis = Number(precio.value) === 0 ? " El precio 0 se registrará como producto FREE." : "";
      mostrarAviso(idFormulario, "Producto válido." + gratis + " Los datos quedarían guardados al conectar la API.", "ok");
    } else {
      mostrarAviso(idFormulario, "Hay campos con errores. Corrígelos antes de guardar.", "error");
    }
  });
}

/* ============================================================
   4. Arranque: cada página inicializa solo lo que tiene
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  iniciarFormularioLogin();
  iniciarFormularioContacto();
  iniciarFormularioUsuario("form-registro");
  iniciarFormularioUsuario("form-usuario");
  iniciarFormularioProducto("form-producto");
});
