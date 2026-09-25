# Sonido Vivo — Frontend (Evaluación Parcial 1)

Tienda online de instrumentos musicales desarrollada con **HTML5, CSS3 y JavaScript**. Corresponde a la entrega 1 de la asignatura DSY1104 (Desarrollo
Fullstack II) — Duoc UC, caso: Sonido Vivo, Viña del Mar.

## Integrantes

| Integrante | Responsabilidad principal |
| Oscar Inaipil | Estilos de la tienda, catálogo, carrito y blogs |
| Ignacio Vilches | Panel de administración y documentación |
| Diego Saavedra | Vistas de producto, formularios y validaciones |

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

Esta primera entrega deja operativo el frontend completo: navegación entre las once
vistas públicas, catálogo dinámico con buscador y filtros, carrito con persistencia,
formularios validados y el panel de administración con sus dos mantenedores.

Las entregas siguientes incorporarán la migración a React, los microservicios en
Spring Boot con API REST, la base de datos relacional y el despliegue en la nube.

---

## Estructura del proyecto

Tienda_Sonido_Vivo/
├── .gitignore                    Archivos ignorados por Git
├── README.md                     Documentación y guía de ejecución
│
├── index.html                    Home: hero, destacados y pasos de compra
├── productos.html                Catálogo con buscador, filtros y ordenamiento
├── detalle-producto.html         Ficha del producto (?codigo=GA001) + relacionados
├── carrito.html                  Carrito de compras, cupones y totales
├── login.html                    Inicio de sesión
├── registro.html                 Registro público de clientes
├── contacto.html                 Formulario de contacto
├── nosotros.html                 Historia de la tienda, video embebido y equipo
├── blogs.html                    Listado de noticias
├── blog-1.html / blog-2.html     Detalle de cada nota
│
├── admin/                        Panel de administración (acceso restringido)
│   ├── index.html                Resumen de inventario y alerta de stock crítico
│   ├── productos.html            Listado del mantenedor de productos
│   ├── producto-nuevo.html       Alta de producto
│   ├── producto-editar.html      Edición de producto (?codigo=GA001)
│   ├── producto-detalle.html     Ficha del producto en el panel
│   ├── usuarios.html             Listado del mantenedor de usuarios
│   ├── usuario-nuevo.html        Alta de usuario
│   ├── usuario-editar.html       Edición de usuario (?run=190110222)
│   └── usuario-detalle.html      Ficha del usuario en el panel
│
├── css/
│   ├── styles.css                Hoja externa de la tienda: tokens, componentes y responsive
│   └── admin.css                 Layout del panel: menú lateral, tablas e insignias
│
├── js/
│   ├── datos.js                  Catálogo de productos, usuarios de ejemplo y blogs
│   ├── app.js                    Menú responsive, formato de precios y escape de HTML
│   ├── tienda.js                 Render del catálogo, buscador, filtros y detalle
│   ├── carrito.js                Carrito con persistencia en localStorage
│   ├── regiones.js               Regiones y comunas con selects encadenados
│   ├── validaciones.js           Validación de todos los formularios del sitio
│   └── admin.js                  Tablas y mantenedores del panel
│
├── assets/img/                   Fotografías del catálogo y logotipo
│
└── documentos/
    ├── Planilla_Requerimientos_Historias_Sonido_Vivo.xlsx
    └── ERS_Sonido_Vivo_v1.docx
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

6. **Panel de administración (`admin/`):**
   - Resumen de inventario con alerta de productos en stock crítico.
   - Mantenedor de productos: listado con buscador y filtro, alta, edición y ficha de detalle.
   - Mantenedor de usuarios: listado con buscador por RUN, nombre o correo, y filtro por perfil.
   - La baja de un registro modifica el arreglo, no solo la fila de la tabla.

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

## Validaciones con JavaScript (`js/validaciones.js`)

Todas se ejecutan al salir del campo (`blur`) y al enviar el formulario. El mensaje
aparece **bajo el campo correspondiente**; no se usa `alert()` en ningún caso.

| Formulario | Reglas |
|---|---|
| Inicio de sesión | Correo requerido, máx. 100, solo `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`. Contraseña de 4 a 10 caracteres. |
| Contacto | Nombre requerido máx. 100. Correo opcional con dominios permitidos. Comentario requerido máx. 500 con contador en vivo. |
| Registro y usuario | RUN requerido de 7 a 9 caracteres, sin puntos ni guion, validado con módulo 11. Nombre máx. 50, apellidos máx. 100. Fecha de nacimiento opcional sin fechas futuras. Región y comuna encadenadas. Dirección requerida máx. 300. |
| Producto | Código requerido mín. 3 caracteres. Nombre máx. 100, descripción opcional máx. 500. Precio mín. 0 con decimales (0 = producto FREE). Stock entero mín. 0. Stock crítico opcional. Categoría requerida. |

---

## Diseño y estilos

- Hoja de estilos **externa**; sin estilos en línea ni etiquetas `<style>`.
- **Tokens de diseño (`:root`):**
  - Paleta del rubro: azul tolex (`#16232f`), tela de rejilla hueso (`#f2ede4`) y ámbar de luz piloto (`#e0a13c`).
  - Tipografías: Space Grotesk (títulos) e IBM Plex Sans (texto de lectura).
  - Variables de espaciado y radios base.
- Reset global y normalización de elementos HTML.
- **Diseño responsivo** probado en 360 px (menú hamburguesa), 768 px y 1280 px.
- **Accesibilidad:** enlace para saltar al contenido, foco visible, `aria-current` en la
  navegación, etiquetas asociadas a cada campo y respeto por `prefers-reduced-motion`.
  

  ---

## Créditos de las imágenes

Las fotografías del catálogo provienen de Unsplash y del navegador de Google. El logotipo construido en SVG
