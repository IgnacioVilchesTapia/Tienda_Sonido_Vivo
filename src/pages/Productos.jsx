import { useState } from 'react'

export default function Productos() {
  // Estados para manejar los filtros en React
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [orden, setOrden] = useState('')

  return (
    <main id="contenido">
      <section className="seccion">
        <div className="contenedor">
          <div className="seccion__encabezado">
            <div>
              <h1>Catálogo de Productos</h1>
              <p id="conteo-resultados">Cargando productos…</p>
            </div>
          </div>

          <form className="filtros" role="search" noValidate onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="filtro-busqueda">Buscar</label>
              <input
                type="search"
                id="filtro-busqueda"
                placeholder="Guitarra, Boss, GA001…"
                autoComplete="off"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filtro-categoria">Categoría</label>
              <select
                id="filtro-categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {/* Las categorías se pueden cargar dinámicamente desde tus datos */}
              </select>
            </div>
            <div>
              <label htmlFor="filtro-orden">Ordenar por</label>
              <select
                id="filtro-orden"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="">Orden del catálogo</option>
                <option value="precio-asc">Precio: de menor a mayor</option>
                <option value="precio-desc">Precio: de mayor a menor</option>
                <option value="nombre">Nombre (A-Z)</option>
              </select>
            </div>
          </form>

          <div className="mensaje" id="aviso-carrito" hidden></div>
          
          <div className="grilla-productos" id="catalogo">
            {/* Aquí mapearás los productos de datos.js más adelante */}
          </div>
        </div>
      </section>
    </main>
  )
}