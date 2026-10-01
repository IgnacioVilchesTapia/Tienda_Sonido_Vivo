import { Link } from 'react-router-dom'

export default function Registro() {
  return (
    <main id="contenido">
      <section className="seccion">
        <div className="contenedor">
          <form className="formulario formulario--centrado" id="form-registro" noValidate>
            <h1>Registro de usuario</h1>
            <p className="formulario__intro">
              Con tu cuenta puedes hacer pedidos, elegir retiro en tienda y revisar tu historial de compras.
            </p>
            <div className="mensaje" role="status" hidden></div>

            <div className="campo">
              <label htmlFor="run">RUN</label>
              <input type="text" id="run" name="run" maxLength={9} placeholder="190110222" required />
              <span className="ayuda">Sin puntos ni guion. Entre 7 y 9 caracteres.</span>
              <span className="error" role="alert"></span>
            </div>

            <div className="fila">
              <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" maxLength={50} autoComplete="given-name" required />
                <span className="error" role="alert"></span>
              </div>
              <div className="campo">
                <label htmlFor="apellidos">Apellidos</label>
                <input type="text" id="apellidos" name="apellidos" maxLength={100} autoComplete="family-name" required />
                <span className="error" role="alert"></span>
              </div>
            </div>

            <div className="campo">
              <label htmlFor="correo">Correo</label>
              <input
                type="email"
                id="correo"
                name="correo"
                maxLength={100}
                autoComplete="email"
                placeholder="nombre@duoc.cl"
                list="dominios"
                required
              />
              <datalist id="dominios">
                <option value="@duoc.cl"></option>
                <option value="@profesor.duoc.cl"></option>
                <option value="@gmail.com"></option>
              </datalist>
              <span className="ayuda">Solo @duoc.cl, @profesor.duoc.cl y @gmail.com.</span>
              <span className="error" role="alert"></span>
            </div>

            <div className="fila">
              <div className="campo">
                <label htmlFor="clave">Contraseña</label>
                <input
                  type="password"
                  id="clave"
                  name="clave"
                  minLength={4}
                  maxLength={10}
                  autoComplete="new-password"
                  required
                />
                <span className="ayuda">Entre 4 y 10 caracteres.</span>
                <span className="error" role="alert"></span>
              </div>
              <div className="campo">
                <label htmlFor="clave2">Confirmar contraseña</label>
                <input
                  type="password"
                  id="clave2"
                  name="clave2"
                  minLength={4}
                  maxLength={10}
                  autoComplete="new-password"
                  required
                />
                <span className="error" role="alert"></span>
              </div>
            </div>

            <div className="campo">
              <label htmlFor="nacimiento">
                Fecha de nacimiento <span className="opcional">(opcional)</span>
              </label>
              <input type="date" id="nacimiento" name="nacimiento" max="2026-09-03" />
              <span className="error" role="alert"></span>
            </div>

            <div className="fila">
              <div className="campo">
                <label htmlFor="region">Región</label>
                <select id="region" name="region" required>
                  <option value="">Selecciona una región</option>
                </select>
                <span className="error" role="alert"></span>
              </div>
              <div className="campo">
                <label htmlFor="comuna">Comuna</label>
                <select id="comuna" name="comuna" required disabled>
                  <option value="">Selecciona una comuna</option>
                </select>
                <span className="ayuda">Se activa al elegir región.</span>
                <span className="error" role="alert"></span>
              </div>
            </div>

            <div className="campo">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                maxLength={300}
                autoComplete="street-address"
                required
              />
              <span className="ayuda">Calle, número y departamento. Máximo 300 caracteres.</span>
              <span className="error" role="alert"></span>
            </div>

            <button className="boton boton--primario" type="submit">
              Crear mi cuenta
            </button>
            <p className="ayuda">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>.
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}