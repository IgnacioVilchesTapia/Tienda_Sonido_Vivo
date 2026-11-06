# Sonido Vivo — Backend

API REST de la tienda Sonido Vivo para DSY1104 Desarrollo Fullstack II (Duoc UC), caso Forma B. Este backend vive en la rama `backend` del repo; el frontend está en `main`.

## Integrantes

- Oscar Inaipil
- Ignacio Vilches
- Diego Saavedra

## Tecnologías

- Java 21 y Spring Boot 4.1 (Web MVC, Data JPA, Validation)
- MySQL 8
- Swagger con springdoc-openapi
- Docker y Docker Compose para el despliegue en AWS EC2

## Qué tiene hoy

- Catálogo: CRUD de productos y categorías en `/api/v1`
- `data.sql` carga las 10 categorías y los 51 productos de la tienda al iniciar (si un producto base se borra, vuelve a aparecer al reiniciar)
- Errores en JSON con el mismo formato: `status`, `error`, `mensaje`, `ruta`
- Pruebas unitarias de los servicios (JUnit + Mockito) y del controlador de productos (MockMvc)

Lo que falta, según el plan de trabajo: Spring Security con JWT y usuarios (carpeta `security`), boletas y reportes.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
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
- `config`: Swagger y CORS
- `security`: pendiente (JWT)
- `deploy`: docker-compose y script para preparar la instancia EC2
