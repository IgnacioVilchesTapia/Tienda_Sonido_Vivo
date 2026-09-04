# Sonido Vivo — Frontend (Evaluación Parcial 1)

Tienda online de instrumentos musicales desarrollada con **HTML5, CSS3 y JavaScript**. Corresponde a la entrega 1 de la asignatura DSY1104 (Desarrollo
Fullstack II) — Duoc UC, caso: Sonido Vivo, Viña del Mar.

## Integrantes

| Integrante |
|---|---|
| (Oscar Inaipil) |
| (Ignacio Vilches) | 
| (Diego saavedra) | 

## Cómo ejecutar

El proyecto es estático, pero conviene servirlo por HTTP para que `localStorage` y las rutas
funcionen igual que en producción:

```bash
# opción 1: extensión Live Server de VS Code (clic derecho sobre index.html)
# opción 2: servidor de Python
python -m http.server 8000
# luego abrir http://localhost:8000
```

Abrir `index.html` con doble clic también funciona; en ese caso el carrito usa un respaldo en
memoria si el navegador bloquea `localStorage` bajo el protocolo `file://`.

## Alcance del proyecto

El repositorio se encuentra actualmente en desarrollo.

Esta primera etapa deja operativa la experiencia de navegación, consulta de productos y carrito de compras en el cliente. Las etapas siguientes incorporarán los formularios de usuario, validaciones, estilos complementarios y el panel administrativo.

---

## Estructura del proyecto (hasta Commit 12)

```
sonido-vivo-frontend/
├── .gitignore                 Archivos ignorados por Git
├── README.md                  Documentación y guía de ejecución
├── index.html                 Home: hero, destacados y pasos de compra
├── productos.html             Catálogo con buscador, filtros y ordenamiento
├── detalle-producto.html      Ficha del producto (?codigo=GA001) + relacionados
├── carrito.html               Vista del carrito de compras y totales
├── nosotros.html              Historia, video embebido, mapa y equipo
├── blogs.html                 Listado de noticias
├── blog-1.html / blog-2.html  Detalle de cada nota
├── css/
│   └── styles.css             Estilos base (Parte 1: tokens, paleta, tipografías y reset)
└── js/
    ├── datos.js               Catálogo base de productos y artículos de blog
    ├── tienda.js              Render del catálogo, buscador, filtros y detalle
    └── carrito.js             Lógica del carrito con persistencia en localStorage
```

---

## Funcionalidades implementadas

1. **Página Principal (`index.html`):**
   - Hero con llamado a la acción hacia el catálogo.
   - Vitrina de productos destacados y resumen de pasos de compra.
2. **Catálogo de Productos (`productos.html`):**
   - Renderizado dinámico desde `js/datos.js`.
   - Búsqueda en tiempo real por texto (nombre/marca).
   - Filtrado por categorías de instrumentos.
   - Ordenamiento por precio (menor a mayor / mayor a menor) y alfabético.
3. **Ficha de Detalle (`detalle-producto.html`):**
   - Carga dinámica según parámetro de URL (`?codigo=...`).
   - Muestra ficha técnica, stock actual, precio y control para añadir al carrito.
   - Listado de productos relacionados de la misma categoría.
4. **Carrito de Compras (`carrito.html`):**
   - Tabla interactiva de productos seleccionados con actualización de cantidades.
   - Cálculo dinámico de subtotal, descuentos por cupón, despacho y total.
5. **Secciones Informativas:**
   - **Nosotros (`nosotros.html`):** Historia, mapa de ubicación en Viña del Mar y video institucional embebido.
   - **Blog (`blogs.html`, `blog-1.html`, `blog-2.html`):** Artículos y notas informativas.

---

## Reglas de negocio del carrito (`js/carrito.js`)

1. No se puede agregar más unidades que el stock disponible en inventario.
2. Si el producto ya está en el carrito, se incrementa la cantidad en la misma fila sin duplicarla.
3. Cantidad mínima de 1 unidad: disminuir de 1 elimina el producto del carrito.
4. Cupones de descuento: `SONIDOVIVO10` (10% descuento) y `MUSICO5` (5% descuento).
5. Costo de despacho: $4.990; envío gratuito para compras sobre $150.000.
6. Los precios del catálogo incluyen IVA.
7. Persistencia en `localStorage` bajo la clave `sonidoVivo.carrito` y el cupón activo en `sessionStorage` (`sonidoVivo.cupon`).
8. Normalización de cantidades a enteros positivos (mínimo 1), descartando decimales, negativos o texto.
9. Sincronización en tiempo real entre pestañas abiertas mediante el evento `storage`.
10. Respaldo en memoria (`carritoEnMemoria`) en caso de que el navegador bloquee `localStorage` bajo el protocolo `file://` o modo privado.

---

## Diseño y estilos (Parte 1)


- Hoja de estilos **externa**; sin estilos en línea ni etiquetas `<style>`.
- **Tokens de diseño (`:root`):**
  - Paleta del rubro: azul tolex (`#16232f`), tela de rejilla hueso (`#f2ede4`) y ámbar de luz piloto (`#e0a13c`).
  - Tipografías: Space Grotesk (títulos) e IBM Plex Sans (texto de lectura).
  - Variables de espaciado y radios base.
- Reset global y normalización de elementos HTML.


---