# Sonido Vivo

Tienda online de instrumentos musicales para la asignatura DSY1104 Desarrollo Fullstack II (Duoc UC), caso Forma B.

La tienda tiene la parte del cliente (catálogo, carrito, checkout, blog, registro e inicio de sesión) y el panel de administración (productos, categorías, usuarios, órdenes, reportes y perfil).

## Integrantes

- Oscar Inaipil
- Ignacio Vilches
- Diego Saavedra

## Tecnologías

- React 19 con Vite
- React Router para las rutas
- Bootstrap 5 y Bootstrap Icons (por CDN en index.html)
- Jasmine y Karma para las pruebas unitarias, con React Testing Library


## Cómo levantar el proyecto

Hay que tener Node.js instalado. En la terminal, dentro de la carpeta del proyecto:

```
npm install
npm run dev
```

Después abrir http://localhost:5173

## Pruebas

```
npm run test:karma
```

Se abre Chrome con el resultado de las pruebas. Al terminar se crea la carpeta `coverage` y el reporte de cobertura se ve abriendo `coverage/index.html`.

Para correrlas una sola vez y sin abrir la ventana de Chrome:

```
npm run test:karma:ci
```

## Carpetas

- `src/pages`: vistas de la tienda
- `src/pages/admin`: vistas del panel de administración
- `src/components`: componentes reutilizables (Boton, ProductoCard, ProductoLista)
- `src/context`: CartContext, el estado del carrito
- `src/core`: Layout con el menú y el footer
- `src/data`: datos de la tienda y regiones de Chile
- `src/hooks`: useFetch, para cuando esté la API
- `src/utils`: validaciones de los formularios
- `docs`: ERS y planilla de requerimientos

Las pruebas están al lado del archivo que prueban y terminan en `.spec.js` o `.spec.jsx`.

## Para probar

- Administrador: c.pizarro@duoc.cl (cualquier contraseña de 4 a 10 caracteres)
- Cliente: fsoto2000@gmail.com, o registrarse con un correo @duoc.cl, @profesor.duoc.cl o @gmail.com
- Cupones: SONIDOVIVO10 (10%) y MUSICO5 (5%)
- El despacho cuesta $4.990 y es gratis sobre $150.000
- El pago es simulado, a veces sale rechazado a propósito para ver la pantalla de error

Para volver a los datos iniciales hay que borrar el localStorage del sitio (F12, Application, Local Storage).
