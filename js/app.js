/**
 * js/app.js
 * Utilidades globales y control de la interfaz (UI) base.
 * Proyecto: Sonido Vivo
 */

// ==========================================
// 1. FORMATO DE PRECIOS
// ==========================================
// Convierte un número entero al formato de moneda chilena (CLP)
const formatearPrecio = (valor) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0 // En Chile no usamos decimales en las compras habituales
    }).format(valor);
};

// ==========================================
// 2. ESCAPE DE HTML (Seguridad)
// ==========================================
// Previene ataques de inyección de código (XSS) reemplazando caracteres especiales
const escaparHTML = (texto) => {
    if (!texto) return '';
    const mapaCaracteres = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(texto).replace(/[&<>"']/g, (m) => mapaCaracteres[m]);
};

// Exponer las funciones globalmente para que otros archivos (tienda.js, carrito.js) puedan usarlas
window.formatearPrecio = formatearPrecio;
window.escaparHTML = escaparHTML;

// ==========================================
// 3. MENÚ RESPONSIVE Y UTILIDADES DEL DOM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Menú Responsive ---
    const botonMenu = document.querySelector('.boton-menu');
    const menu = document.getElementById('menu');

    if (botonMenu && menu) {
        botonMenu.addEventListener('click', () => {
            // Leer el estado actual
            const expandido = botonMenu.getAttribute('aria-expanded') === 'true';
            
            // Cambiar los atributos de accesibilidad
            botonMenu.setAttribute('aria-expanded', !expandido);
            
            // Mostrar/ocultar el menú mediante una clase CSS
            menu.classList.toggle('menu-activo');
            
            // Cambiar visualmente el ícono del botón
            if (!expandido) {
                botonMenu.innerHTML = '✕ Cerrar';
            } else {
                botonMenu.innerHTML = '☰ Menú';
            }
        });
    }

    // --- Actualización automática del año en el Footer ---
    const spanAnio = document.getElementById('anio');
    if (spanAnio) {
        const anioActual = new Date().getFullYear();
        spanAnio.textContent = anioActual;
    }
});