# Sonido Vivo — Backend

API REST de la tienda Sonido Vivo para DSY1104 Desarrollo Fullstack II (Duoc UC), caso Forma B. Este backend vive en la rama `backend` del repo; el frontend está en `main`.

## Integrantes

- Oscar Inaipil
- Ignacio Vilches
- Diego Saavedra

## Tecnologías

- Java 21 y Spring Boot 4.1 (Web MVC, Data JPA, Validation, Security)
- JWT con jjwt (token de acceso de 30 minutos y refresh token de 7 días)
- MySQL 8
- Swagger con springdoc-openapi
- Docker y Docker Compose para el despliegue en AWS EC2

## Qué tiene hoy

- Catálogo: CRUD de productos y categorías en `/api/v1`
- `data.sql` carga las 10 categorías y los 51 productos de la tienda al iniciar (si un producto base se borra, vuelve a aparecer al reiniciar)
- Seguridad con Spring Security y JWT: login, registro, refresh, perfil propio y CRUD de usuarios solo para ADMIN
- Contraseñas guardadas con BCrypt; RUN validado con dígito verificador y correos solo `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`
- Errores en JSON con el mismo formato: `status`, `error`, `mensaje`, `ruta` (también el 401 y el 403)
- Pruebas unitarias de los servicios (JUnit + Mockito) y de los controladores (MockMvc), incluidas las de seguridad

Lo que falta, según el plan de trabajo: boletas y reportes.

## Seguridad

- El login devuelve `token` y `refreshToken`. Las rutas protegidas se llaman con el header `Authorization: Bearer <token>`.
- El token lleva el correo (`sub`), el `rol` y el vencimiento (`exp`).
- Cuando el token vence, `POST /api/v1/auth/refresh` con el `refreshToken` entrega uno nuevo sin pedir la contraseña.
- Sin token o con un token vencido la API responde 401; con un rol que no corresponde, 403.
- Lectura del catálogo pública; crear, editar y borrar productos o categorías y ver stock crítico, solo ADMIN.
- En Swagger, el botón **Authorize** recibe el token para probar las rutas protegidas.

Usuarios de prueba (se crean solos al iniciar si no existen):

| Rol | Correo | Contraseña |
| --- | --- | --- |
| ADMIN | `c.pizarro@duoc.cl` | `admin123` |
| VENDEDOR | `d.rojas@duoc.cl` | `vende123` |
| VENDEDOR | `m.contreras@profesor.duoc.cl` | `vende123` |
| CLIENTE | `fsoto2000@gmail.com` | `cliente123` |

La clave con que se firman los tokens se lee de la variable `JWT_SECRETO` (mínimo 32 caracteres); si no está, se usa una de desarrollo.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/v1/auth/login` | Inicia sesión (público) |
| POST | `/api/v1/auth/registro` | Registra un cliente (público) |
| POST | `/api/v1/auth/refresh` | Renueva el token (público, con refresh token) |
| GET | `/api/v1/auth/me` | Datos del usuario del token |
| GET | `/api/v1/usuarios` | Lista usuarios (ADMIN) |
| GET | `/api/v1/usuarios/{run}` | Detalle de un usuario (ADMIN) |
| POST | `/api/v1/usuarios` | Crea un usuario con cualquier rol (ADMIN) |
| PUT | `/api/v1/usuarios/{run}` | Actualiza un usuario (ADMIN) |
| PUT | `/api/v1/usuarios/me` | Actualiza el perfil propio |
| DELETE | `/api/v1/usuarios/{run}` | Elimina un usuario (ADMIN) |
| GET | `/api/v1/estado` | Comprueba que el backend y la BD responden |
| GET | `/api/v1/productos?categoria=&q=` | Lista productos, con filtros opcionales |
| GET | `/api/v1/productos/{codigo}` | Detalle de un producto |
| GET | `/api/v1/productos/ofertas` | Productos con descuento |
| GET | `/api/v1/productos/criticos` | Productos con stock crítico |
| POST | `/api/v1/productos` | Crea un producto |
| PUT | `/api/v1/productos/{codigo}` | Actualiza un producto |
| DELETE | `/api/v1/productos/{codigo}` | Elimina un producto |
| GET | `/api/v1/categorias` | Lista categorías |
| GET | `/api/v1/categorias/{id}` | Detalle de una categoría |
| POST | `/api/v1/categorias` | Crea una categoría |
| PUT | `/api/v1/categorias/{id}` | Cambia el nombre |
| DELETE | `/api/v1/categorias/{id}` | Elimina (409 si tiene productos) |

Swagger: `http://localhost:8080/swagger-ui.html`

## Cómo levantarlo en local

Con XAMPP encendido (MySQL en el puerto 3306, usuario `root` sin clave). La base `tienda_sonido_vivo` se crea sola.

```
git checkout backend
./mvnw spring-boot:run
```

En Windows: `mvnw.cmd spring-boot:run`, o ejecutar `BackendTiendaSonidoVivoApplication` desde IntelliJ o VS Code.

Con el frontend en desarrollo (`npm run dev` en la rama `main`), Vite reenvía `/api` a `localhost:8080`.

## Despliegue en AWS (EC2 con Docker)

En la instancia se clona el repo dos veces: el frontend y la rama `backend`, una carpeta al lado de la otra.

```
git clone https://github.com/IgnacioVilchesTapia/Tienda_Sonido_Vivo.git
git clone -b backend https://github.com/IgnacioVilchesTapia/Tienda_Sonido_Vivo.git Tienda_Sonido_Vivo_Backend
cd Tienda_Sonido_Vivo_Backend
bash deploy/instalar-docker.sh
sudo docker compose -f deploy/docker-compose.yml up -d --build
```

Queda así:

- Tienda: `http://IP-PUBLICA/`
- Swagger: `http://IP-PUBLICA/swagger-ui.html`
- API: `http://IP-PUBLICA/api/v1/productos`

Para actualizar después de un cambio: `git pull` en las dos carpetas y repetir el último comando.

## Carpetas

- `controller`: rutas de la API
- `service`: reglas de negocio
- `repository`: acceso a la BD con Spring Data JPA
- `model`: entidades (tablas)
- `dto`: lo que entra y sale por la API
- `exception`: errores y su formato JSON
- `config`: Swagger, CORS y usuarios de prueba
- `security`: JWT, filtro del token y reglas de acceso por rol
- `deploy`: docker-compose y script para preparar la instancia EC2
