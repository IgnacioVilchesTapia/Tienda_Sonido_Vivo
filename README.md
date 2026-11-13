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
- Axios para hablar con la API del backend
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

## Backend y despliegue

La tienda se conecta al backend en Spring Boot (rama `backend` de este repo) por la API REST en `/api/v1`:

- Productos, categorías, usuarios y órdenes vienen de MySQL a través de la API. Si el backend no responde, el catálogo muestra un aviso y usa los datos guardados en el navegador.
- El inicio de sesión pide un token JWT al backend. `api.js` lo agrega en cada petición y, si vence, lo renueva con el refresh token.
- La sesión se guarda en el navegador (`AuthContext`), así que sigue activa al recargar la página.
- El checkout manda solo los códigos y las cantidades a `POST /api/v1/boletas`; el backend calcula precios, cupón, despacho y descuenta el stock.
- Cada rol ve solo lo suyo: el administrador entra a todo el panel, el vendedor solo a productos y órdenes (sin editar) y el cliente solo a la tienda.

Para levantarlo:

- En desarrollo: levantar el backend en `localhost:8080` y `npm run dev`; Vite reenvía `/api` al backend.
- En AWS: el `Dockerfile` compila la app y la sirve con nginx (`nginx.conf`), que reenvía `/api` y Swagger al contenedor del backend. Los pasos están en el README de la rama `backend`.

## Carpetas

- `src/pages`: vistas de la tienda
- `src/pages/admin`: vistas del panel de administración
- `src/components`: componentes reutilizables (Boton, ProductoCard, ProductoLista) y los que protegen las rutas (RutaProtegida, SoloRol)
- `src/context`: AuthContext, la sesión del usuario, y CartContext, el carrito
- `src/core`: Layout con el menú y el footer
- `src/data`: datos de la tienda y regiones de Chile
- `src/hooks`: useFetch y useCatalogo, para pedir datos a la API
- `src/services`: `api.js` con la configuración de axios y un archivo por cada parte de la API (productos, categorías, usuarios, boletas, reportes)
- `src/utils`: validaciones de los formularios
- `docs`: ERS y planilla de requerimientos

Las pruebas están al lado del archivo que prueban y terminan en `.spec.js` o `.spec.jsx`.

## Para probar

Usuarios que crea el backend al partir:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | c.pizarro@duoc.cl | admin123 |
| Vendedor | d.rojas@duoc.cl | vende123 |
| Cliente | fsoto2000@gmail.com | cliente123 |

- También se puede registrar un cliente nuevo con un correo @duoc.cl, @profesor.duoc.cl o @gmail.com
- Cupones: SONIDOVIVO10 (10%) y MUSICO5 (5%)
- El despacho cuesta $4.990 y es gratis sobre $150.000
- El pago es simulado, a veces sale rechazado a propósito para ver la pantalla de error

La sesión y el carrito quedan en el localStorage del sitio (F12, Application, Local Storage). Borrarlo cierra la sesión y vacía el carrito.
