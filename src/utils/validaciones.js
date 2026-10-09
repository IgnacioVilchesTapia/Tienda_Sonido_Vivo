// validaciones.js — Reglas de negocio y validaciones para formularios de Sonido Vivo

export const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/**
 * Valida un RUN chileno utilizando el algoritmo de Módulo 11.
 * @param {string} rutTexto - RUN sin puntos, con o sin guion (ej: 190110222 o 19011022-2)
 * @returns {{ esValido: boolean, mensaje: string }}
 */
export function validarRutChileno(rutTexto) {
  if (!rutTexto || typeof rutTexto !== 'string') {
    return { esValido: false, mensaje: 'El RUN es obligatorio.' };
  }

  // Limpiar puntos, espacios y guiones
  const limpio = rutTexto.replace(/[\.\s-]/g, '').toUpperCase();

  if (limpio.length < 7 || limpio.length > 9) {
    return { esValido: false, mensaje: 'El RUN debe tener entre 7 y 9 caracteres (sin puntos ni guion).' };
  }

  const cuerpo = limpio.slice(0, -1);
  const dvIngresado = limpio.slice(-1);

  if (!/^\d+$/.test(cuerpo)) {
    return { esValido: false, mensaje: 'El cuerpo del RUN debe contener solo dígitos.' };
  }

  // Algoritmo Módulo 11
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado = '';

  if (resto === 11) dvEsperado = '0';
  else if (resto === 10) dvEsperado = 'K';
  else dvEsperado = resto.toString();

  if (dvIngresado !== dvEsperado) {
    return { esValido: false, mensaje: `RUN inválido. El dígito verificador no coincide con el cuerpo.` };
  }

  return { esValido: true, mensaje: 'RUN válido.' };
}

/**
 * Valida formato de correo y dominios institucionales permitidos.
 * @param {string} email
 * @returns {{ esValido: boolean, mensaje: string }}
 */
export function validarEmail(email) {
  if (!email || !email.trim()) {
    return { esValido: false, mensaje: 'El correo electrónico es obligatorio.' };
  }

  const normalizado = email.trim().toLowerCase();
  const formatoBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoBasico.test(normalizado)) {
    return { esValido: false, mensaje: 'Ingresa un correo electrónico con formato válido.' };
  }

  const dominioValido = DOMINIOS_PERMITIDOS.some((dom) => normalizado.endsWith(dom));
  if (!dominioValido) {
    return {
      esValido: false,
      mensaje: `Dominio no permitido. Solo se aceptan correos @duoc.cl, @profesor.duoc.cl y @gmail.com.`
    };
  }

  return { esValido: true, mensaje: 'Correo válido.' };
}

/**
 * Valida longitud de contraseña (entre 4 y 10 caracteres).
 * @param {string} clave
 * @returns {{ esValido: boolean, mensaje: string }}
 */
export function validarPassword(clave) {
  if (!clave || !clave.trim()) {
    return { esValido: false, mensaje: 'La contraseña es obligatoria.' };
  }
  if (clave.length < 4 || clave.length > 10) {
    return { esValido: false, mensaje: 'La contraseña debe tener entre 4 y 10 caracteres.' };
  }
  return { esValido: true, mensaje: 'Contraseña válida.' };
}

/**
 * Valida longitud y contenido requerido de texto.
 */
export function validarTexto(valor, min, max, etiqueta) {
  const v = (valor || '').trim();
  if (min > 0 && v.length === 0) {
    return { esValido: false, mensaje: `${etiqueta} es obligatorio.` };
  }
  if (min > 0 && v.length < min) {
    return { esValido: false, mensaje: `${etiqueta} debe tener al menos ${min} caracteres.` };
  }
  if (max > 0 && v.length > max) {
    return { esValido: false, mensaje: `${etiqueta} no puede superar los ${max} caracteres.` };
  }
  return { esValido: true, mensaje: '' };
}
