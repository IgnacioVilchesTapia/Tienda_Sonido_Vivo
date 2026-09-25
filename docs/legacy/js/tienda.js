// tienda.js — muestra el catálogo en las vistas públicas.
// Todos los productos salen del arreglo PRODUCTOS (js/datos.js), tal como
// pide el enunciado: "listar productos mediante JavaScript".

function etiquetaStock(producto) {
  if (producto.stock === 0) return '<span class="etiqueta-stock etiqueta-stock--agotado">Sin stock</span>';
  if (producto.stock <= producto.stockCritico) return '<span class="etiqueta-stock etiqueta-stock--bajo">Últimas ' + producto.stock + ' unidades</span>';
  return '<span class="etiqueta-stock etiqueta-stock--ok">Disponible</span>';
}

function tarjetaProducto(p) {
  const nombre = escaparHtml(p.nombre);
  const marca = escaparHtml(p.marca);
  const modelo = escaparHtml(p.modelo);
  const categoria = escaparHtml(p.categoria);
  return '' +
    '<article class="tarjeta-producto">' +
      '<a href="detalle-producto.html?codigo=' + p.codigo + '">' +
        '<img src="' + p.imagen + '" alt="' + nombre + ' ' + marca + ' ' + modelo + '" width="560" height="300" loading="lazy">' +
      '</a>' +
      '<div class="tarjeta-producto__cuerpo">' +
        '<p class="tarjeta-producto__marca">' + marca + ' · ' + categoria + '</p>' +
        '<h3 class="tarjeta-producto__nombre"><a href="detalle-producto.html?codigo=' + p.codigo + '">' + nombre + '</a></h3>' +
        '<p class="tarjeta-producto__precio">' + formatearPrecio(p.precio) + '</p>' +
        etiquetaStock(p) +
        '<div class="tarjeta-producto__pie">' +
          '<a class="boton boton--linea" href="detalle-producto.html?codigo=' + p.codigo + '">Ver detalle</a>' +
          '<button class="boton boton--primario" type="button" data-agregar="' + p.codigo + '"' + (p.stock === 0 ? " disabled" : "") + '>Agregar</button>' +
        '</div>' +
      '</div>' +
    '</article>';
}

/* ---------- Home: productos destacados ---------- */
function dibujarDestacados() {
  const zona = document.getElementById("destacados");
  if (!zona) return;
  const destacados = PRODUCTOS.filter(function (p) { return p.stock > 0; }).slice(0, 8);
  zona.innerHTML = destacados.map(tarjetaProducto).join("");
}

/* ---------- Página productos: listado con filtros ---------- */
function dibujarCatalogo() {
  const zona = document.getElementById("catalogo");
  if (!zona) return;

  const selCategoria = document.getElementById("filtro-categoria");
  const selOrden = document.getElementById("filtro-orden");
  const buscador = document.getElementById("filtro-busqueda");
  const conteo = document.getElementById("conteo-resultados");

  if (selCategoria && selCategoria.options.length <= 1) {
    CATEGORIAS.forEach(function (c) {
      const opcion = document.createElement("option");
      opcion.value = c;
      opcion.textContent = c;
      selCategoria.appendChild(opcion);
    });
    // Permite llegar desde el pie de página: productos.html?categoria=Accesorios
    const desdeUrl = parametroUrl("categoria");
    if (desdeUrl) selCategoria.value = desdeUrl;
  }

  function aplicar() {
    let lista = PRODUCTOS.slice();

    if (selCategoria && selCategoria.value) {
      lista = lista.filter(function (p) { return p.categoria === selCategoria.value; });
    }
    if (buscador && buscador.value.trim() !== "") {
      const texto = buscador.value.trim().toLowerCase();
      lista = lista.filter(function (p) {
        return (p.nombre + " " + p.marca + " " + p.modelo + " " + p.codigo).toLowerCase().includes(texto);
      });
    }
    if (selOrden) {
      if (selOrden.value === "precio-asc") lista.sort(function (a, b) { return a.precio - b.precio; });
      if (selOrden.value === "precio-desc") lista.sort(function (a, b) { return b.precio - a.precio; });
      if (selOrden.value === "nombre") lista.sort(function (a, b) { return a.nombre.localeCompare(b.nombre); });
    }

    zona.innerHTML = lista.length
      ? lista.map(tarjetaProducto).join("")
      : '<p class="vacio">No hay productos que coincidan con la búsqueda. Prueba con otra categoría o borra el texto.</p>';

    if (conteo) {
      conteo.textContent = lista.length === 1 ? "1 producto" : lista.length + " productos";
    }
  }

  if (selCategoria) selCategoria.addEventListener("change", aplicar);
  if (selOrden) selOrden.addEventListener("change", aplicar);
  if (buscador) buscador.addEventListener("input", aplicar);
  aplicar();
}

/* ---------- Detalle de producto ---------- */
function dibujarDetalle() {
  const zona = document.getElementById("detalle-producto");
  if (!zona) return;

  const codigo = parametroUrl("codigo") || PRODUCTOS[0].codigo;
  const p = PRODUCTOS.find(function (x) { return x.codigo === codigo; });

  if (!p) {
    zona.innerHTML = '<p class="vacio">No encontramos ese producto. Vuelve al <a href="productos.html">catálogo</a>.</p>';
    return;
  }

  document.title = p.nombre + " — Sonido Vivo";
  const migas = document.getElementById("migas-categoria");
  if (migas) {
    migas.textContent = p.categoria;
    migas.href = "productos.html?categoria=" + encodeURIComponent(p.categoria);
  }
  const migaNombre = document.getElementById("migas-producto");
  if (migaNombre) migaNombre.textContent = p.nombre;

  const nombre = escaparHtml(p.nombre);
  const descripcion = escaparHtml(p.descripcion);

  zona.innerHTML = '' +
    '<div class="detalle__galeria">' +
      '<img id="imagen-principal" src="' + p.imagen + '" alt="' + nombre + '" width="560" height="300">' +
      '<div class="detalle__miniaturas">' +
        '<img src="' + p.imagen + '" alt="Vista frontal de ' + nombre + '">' +
        '<img src="' + p.imagen + '" alt="Vista lateral de ' + nombre + '">' +
        '<img src="' + p.imagen + '" alt="Detalle de ' + nombre + '">' +
      '</div>' +
    '</div>' +
    '<div>' +
      '<h1>' + nombre + '</h1>' +
      '<p class="tarjeta-producto__marca">' + escaparHtml(p.marca + ' ' + p.modelo) + ' · código ' + p.codigo + '</p>' +
      '<p class="detalle__precio">' + formatearPrecio(p.precio) + '</p>' +
      '<p>' + descripcion + '</p>' +
      '<p>' + etiquetaStock(p) + '</p>' +
      '<div class="selector-cantidad">' +
        '<label for="cantidad">Cantidad</label>' +
        '<input type="number" id="cantidad" value="1" min="1" max="' + Math.max(p.stock, 1) + '">' +
        '<button class="boton boton--primario" type="button" data-agregar="' + p.codigo + '"' + (p.stock === 0 ? " disabled" : "") + '>Agregar al carrito</button>' +
      '</div>' +
      '<div class="mensaje" id="aviso-carrito" hidden></div>' +
      '<dl class="ficha">' +
        '<div><dt>Categoría</dt><dd>' + escaparHtml(p.categoria) + '</dd></div>' +
        '<div><dt>Marca</dt><dd>' + escaparHtml(p.marca) + '</dd></div>' +
        '<div><dt>Modelo</dt><dd>' + escaparHtml(p.modelo) + '</dd></div>' +
        '<div><dt>Stock en tienda</dt><dd>' + p.stock + ' unidades</dd></div>' +
        '<div><dt>Retiro en Viña del Mar</dt><dd>Disponible</dd></div>' +
      '</dl>' +
    '</div>';

  // Relacionados de la misma categoría
  const relacionados = document.getElementById("relacionados");
  if (relacionados) {
    const lista = PRODUCTOS.filter(function (x) {
      return x.categoria === p.categoria && x.codigo !== p.codigo;
    }).slice(0, 4);
    relacionados.innerHTML = lista.map(tarjetaProducto).join("");
  }
}

/* ---------- Listado de blogs ---------- */
function dibujarBlogs() {
  const zona = document.getElementById("lista-blogs");
  if (!zona) return;

  zona.innerHTML = BLOGS.map(function (b) {
    return '' +
      '<article class="entrada-blog">' +
        '<div class="entrada-blog__texto">' +
          '<h2>' + escaparHtml(b.titulo) + '</h2>' +
          '<p>' + escaparHtml(b.resumen) + '</p>' +
          '<a class="boton boton--oscuro" href="' + b.url + '">Leer el caso</a>' +
        '</div>' +
        '<img src="' + b.imagen + '" alt="' + escaparHtml(b.titulo) + '" width="560" height="300" loading="lazy">' +
      '</article>';
  }).join("");
}

document.addEventListener("DOMContentLoaded", function () {
  dibujarDestacados();
  dibujarCatalogo();
  dibujarDetalle();
  dibujarBlogs();
});
