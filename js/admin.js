
let repintarProductos = null;
let repintarUsuarios = null;

/* ---------- Resumen del home administrativo ---------- */
function dibujarResumen() {
  const zona = document.getElementById("resumen-admin");
  if (!zona) return;

  const criticos = PRODUCTOS.filter(function (p) { return p.stock <= p.stockCritico; });
  const valorInventario = PRODUCTOS.reduce(function (s, p) { return s + p.precio * p.stock; }, 0);

  const datos = [
    { valor: PRODUCTOS.length, etiqueta: "Productos publicados", alerta: false },
    { valor: USUARIOS.length, etiqueta: "Usuarios registrados", alerta: false },
    { valor: criticos.length, etiqueta: "Productos en stock crítico", alerta: criticos.length > 0 },
    { valor: formatearPrecio(valorInventario), etiqueta: "Valor del inventario", alerta: false }
  ];

  zona.innerHTML = datos.map(function (d) {
    return '<div class="tarjeta-dato' + (d.alerta ? " tarjeta-dato--alerta" : "") + '">' +
      '<p class="tarjeta-dato__valor">' + d.valor + '</p>' +
      '<p class="tarjeta-dato__etiqueta">' + d.etiqueta + '</p>' +
    '</div>';
  }).join("");

  const tablaCriticos = document.querySelector("#tabla-criticos tbody");
  if (tablaCriticos) {
    tablaCriticos.innerHTML = criticos.length
      ? criticos.map(function (p) {
          return '<tr><td>' + p.codigo + '</td><td>' + p.nombre + '</td><td>' + p.categoria + '</td>' +
                 '<td class="numerico"><span class="insignia insignia--critico">' + p.stock + '</span></td>' +
                 '<td class="numerico">' + p.stockCritico + '</td></tr>';
        }).join("")
      : '<tr><td colspan="5">Ningún producto está bajo su stock crítico.</td></tr>';
  }
}

/* ---------- Mantenedor de productos ---------- */
function dibujarTablaProductos() {
  const cuerpo = document.querySelector("#tabla-productos tbody");
  if (!cuerpo) return;

  const buscador = document.getElementById("buscar-producto");
  const filtroCategoria = document.getElementById("filtrar-categoria");

  if (filtroCategoria && filtroCategoria.options.length <= 1) {
    CATEGORIAS.forEach(function (c) {
      const opcion = document.createElement("option");
      opcion.value = c;
      opcion.textContent = c;
      filtroCategoria.appendChild(opcion);
    });
  }

  function pintar() {
    let lista = PRODUCTOS.slice();
    if (filtroCategoria && filtroCategoria.value) {
      lista = lista.filter(function (p) { return p.categoria === filtroCategoria.value; });
    }
    if (buscador && buscador.value.trim() !== "") {
      const texto = buscador.value.trim().toLowerCase();
      lista = lista.filter(function (p) {
        return (p.codigo + " " + p.nombre + " " + p.marca).toLowerCase().includes(texto);
      });
    }

    cuerpo.innerHTML = lista.map(function (p) {
      const critico = p.stock <= p.stockCritico;
      return '<tr>' +
        '<td>' + p.codigo + '</td>' +
        '<td>' + escaparHtml(p.nombre) + '</td>' +
        '<td>' + escaparHtml(p.categoria) + '</td>' +
        '<td class="numerico">' + formatearPrecio(p.precio) + '</td>' +
        '<td class="numerico">' + (critico ? '<span class="insignia insignia--critico">' + p.stock + '</span>' : p.stock) + '</td>' +
        '<td><div class="acciones-fila">' +
          '<a class="boton boton--linea" href="producto-detalle.html?codigo=' + p.codigo + '">Ver</a>' +
          '<a class="boton boton--linea" href="producto-editar.html?codigo=' + p.codigo + '">Editar</a>' +
          '<button class="boton boton--peligro" type="button" data-eliminar="' + p.codigo + '">Eliminar</button>' +
        '</div></td>' +
      '</tr>';
    }).join("");

    const conteo = document.getElementById("conteo-productos");
    if (conteo) conteo.textContent = lista.length + " de " + PRODUCTOS.length + " productos";
  }

  if (buscador) buscador.addEventListener("input", pintar);
  if (filtroCategoria) filtroCategoria.addEventListener("change", pintar);
  repintarProductos = pintar;
  pintar();
}

/* ---------- Mantenedor de usuarios ---------- */
function dibujarTablaUsuarios() {
  const cuerpo = document.querySelector("#tabla-usuarios tbody");
  if (!cuerpo) return;

  const buscador = document.getElementById("buscar-usuario");
  const filtroTipo = document.getElementById("filtrar-tipo");

  function pintar() {
    let lista = USUARIOS.slice();
    if (filtroTipo && filtroTipo.value) {
      lista = lista.filter(function (u) { return u.tipo === filtroTipo.value; });
    }
    if (buscador && buscador.value.trim() !== "") {
      const texto = buscador.value.trim().toLowerCase();
      lista = lista.filter(function (u) {
        return (u.run + " " + u.nombre + " " + u.apellidos + " " + u.correo).toLowerCase().includes(texto);
      });
    }

    cuerpo.innerHTML = lista.map(function (u) {
      const clase = u.tipo === "Administrador" ? "admin" : (u.tipo === "Vendedor" ? "vendedor" : "cliente");
      return '<tr>' +
        '<td>' + u.run + '</td>' +
        '<td>' + escaparHtml(u.nombre + ' ' + u.apellidos) + '</td>' +
        '<td>' + escaparHtml(u.correo) + '</td>' +
        '<td><span class="insignia insignia--' + clase + '">' + u.tipo + '</span></td>' +
        '<td>' + escaparHtml(u.comuna) + '</td>' +
        '<td><div class="acciones-fila">' +
          '<a class="boton boton--linea" href="usuario-detalle.html?run=' + u.run + '">Ver</a>' +
          '<a class="boton boton--linea" href="usuario-editar.html?run=' + u.run + '">Editar</a>' +
          '<button class="boton boton--peligro" type="button" data-eliminar="' + u.run + '">Desactivar</button>' +
        '</div></td>' +
      '</tr>';
    }).join("");
  }

  if (buscador) buscador.addEventListener("input", pintar);
  if (filtroTipo) filtroTipo.addEventListener("change", pintar);
  repintarUsuarios = pintar;
  pintar();
}

/* ---------- Vistas de detalle (mostrar producto / usuario) ---------- */
function dibujarDetalleAdmin() {
  const zonaProducto = document.getElementById("ficha-producto");
  if (zonaProducto) {
    const p = PRODUCTOS.find(function (x) { return x.codigo === parametroUrl("codigo"); });
    // Sin producto no se carga el primero del catálogo: eso llevaría a editar
    // por error un registro distinto al que se pidió.
    if (!p) {
      document.getElementById("titulo-ficha").textContent = "Producto no encontrado";
      zonaProducto.innerHTML = '<p class="vacio">No existe un producto con el código indicado. Vuelve al <a href="productos.html">listado</a>.</p>';
      const botonEditar = document.getElementById("editar-ficha");
      if (botonEditar) botonEditar.hidden = true;
      const imagen = document.getElementById("imagen-ficha");
      if (imagen) imagen.hidden = true;
      return;
    }
    document.getElementById("titulo-ficha").textContent = p.nombre;
    document.getElementById("editar-ficha").href = "producto-editar.html?codigo=" + p.codigo;
    zonaProducto.innerHTML = [
      ["Código", p.codigo], ["Nombre", p.nombre], ["Categoría", p.categoria],
      ["Marca", p.marca], ["Modelo", p.modelo], ["Precio", formatearPrecio(p.precio)],
      ["Stock", p.stock + " unidades"], ["Stock crítico", p.stockCritico],
      ["Descripción", p.descripcion]
    ].map(function (f) {
      return '<div><dt>' + f[0] + '</dt><dd>' + escaparHtml(f[1]) + '</dd></div>';
    }).join("");
    const img = document.getElementById("imagen-ficha");
    if (img) { img.src = "../" + p.imagen; img.alt = p.nombre; }
  }

  const zonaUsuario = document.getElementById("ficha-usuario");
  if (zonaUsuario) {
    const u = USUARIOS.find(function (x) { return x.run === parametroUrl("run"); });
    if (!u) {
      document.getElementById("titulo-ficha").textContent = "Usuario no encontrado";
      zonaUsuario.innerHTML = '<p class="vacio">No existe un usuario con el RUN indicado. Vuelve al <a href="usuarios.html">listado</a>.</p>';
      const botonEditar = document.getElementById("editar-ficha");
      if (botonEditar) botonEditar.hidden = true;
      return;
    }
    document.getElementById("titulo-ficha").textContent = u.nombre + " " + u.apellidos;
    document.getElementById("editar-ficha").href = "usuario-editar.html?run=" + u.run;
    zonaUsuario.innerHTML = [
      ["RUN", u.run], ["Nombre", u.nombre], ["Apellidos", u.apellidos],
      ["Correo", u.correo], ["Tipo de usuario", u.tipo], ["Región", u.region],
      ["Comuna", u.comuna], ["Dirección", u.direccion], ["Fecha de nacimiento", u.nacimiento]
    ].map(function (f) {
      return '<div><dt>' + f[0] + '</dt><dd>' + escaparHtml(f[1]) + '</dd></div>';
    }).join("");
  }
}

/* ---------- Precarga de los formularios de edición ---------- */
function precargarEdicion() {
  const formProducto = document.getElementById("form-producto");
  if (formProducto && parametroUrl("codigo")) {
    const p = PRODUCTOS.find(function (x) { return x.codigo === parametroUrl("codigo"); });
    if (!p) {
      const aviso = formProducto.querySelector(".mensaje");
      aviso.className = "mensaje mensaje--error";
      aviso.hidden = false;
      aviso.textContent = "No existe un producto con el código " + parametroUrl("codigo") + ". El formulario quedó vacío.";
    }
    if (p) {
      formProducto.dataset.categoria = p.categoria;
      document.getElementById("codigo").value = p.codigo;
      document.getElementById("nombre").value = p.nombre;
      document.getElementById("descripcion").value = p.descripcion;
      document.getElementById("precio").value = p.precio;
      document.getElementById("stock").value = p.stock;
      document.getElementById("stock-critico").value = p.stockCritico;
    }
  }

  const formUsuario = document.getElementById("form-usuario");
  if (formUsuario && parametroUrl("run")) {
    const u = USUARIOS.find(function (x) { return x.run === parametroUrl("run"); });
    if (!u) {
      const aviso = formUsuario.querySelector(".mensaje");
      aviso.className = "mensaje mensaje--error";
      aviso.hidden = false;
      aviso.textContent = "No existe un usuario con el RUN " + parametroUrl("run") + ". El formulario quedó vacío.";
    }
    if (u) {
      formUsuario.dataset.comuna = u.comuna;
      document.getElementById("run").value = u.run;
      document.getElementById("nombre").value = u.nombre;
      document.getElementById("apellidos").value = u.apellidos;
      document.getElementById("correo").value = u.correo;
      document.getElementById("direccion").value = u.direccion;
      document.getElementById("nacimiento").value = u.nacimiento;
      document.getElementById("tipo").value = u.tipo;
      document.getElementById("region").value = u.region;
      document.getElementById("region").dispatchEvent(new Event("change"));
      document.getElementById("comuna").value = u.comuna;
    }
  }
}

/* ---------- Baja de registros ----------
   Se pide confirmación en la misma fila (sin window.confirm, que bloquea el
   navegador) y se elimina del arreglo, no solo del DOM: si se borrara solo la
   fila, el registro reaparecería al buscar o filtrar. */
function activarEliminar() {
  document.addEventListener("click", function (evento) {
    const boton = evento.target.closest("[data-eliminar]");
    if (!boton) return;

    const fila = boton.closest("tr");
    const clave = boton.dataset.eliminar;

    // Primer clic: pedir confirmación en la propia fila
    if (boton.dataset.confirmando !== "si") {
      boton.dataset.confirmando = "si";
      boton.dataset.textoOriginal = boton.textContent;
      boton.textContent = "Confirmar";
      const aviso = document.getElementById("aviso-tabla");
      if (aviso) {
        aviso.className = "mensaje mensaje--error";
        aviso.hidden = false;
        aviso.textContent = "Vuelve a pulsar para dar de baja a " + fila.children[1].textContent + ". Pulsa fuera para cancelar.";
      }
      // Cancelar si el usuario hace clic en otra parte
      setTimeout(function () {
        document.addEventListener("click", function cancelar(e) {
          if (!boton.contains(e.target)) {
            boton.dataset.confirmando = "no";
            boton.textContent = boton.dataset.textoOriginal;
            const a = document.getElementById("aviso-tabla");
            if (a) a.hidden = true;
            document.removeEventListener("click", cancelar);
          }
        });
      }, 0);
      return;
    }

    // Segundo clic: se elimina del arreglo y se repinta la tabla
    let indice = PRODUCTOS.findIndex(function (p) { return p.codigo === clave; });
    if (indice >= 0) {
      PRODUCTOS.splice(indice, 1);
      if (repintarProductos) repintarProductos();
    } else {
      indice = USUARIOS.findIndex(function (u) { return u.run === clave; });
      if (indice >= 0) {
        USUARIOS.splice(indice, 1);
        if (repintarUsuarios) repintarUsuarios();
      }
    }

    const aviso = document.getElementById("aviso-tabla");
    if (aviso) {
      aviso.className = "mensaje mensaje--ok";
      aviso.hidden = false;
      aviso.textContent = "Registro dado de baja. En la entrega 2 esta acción llamará al endpoint DELETE de la API.";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  dibujarResumen();
  dibujarTablaProductos();
  dibujarTablaUsuarios();
  precargarEdicion();
  dibujarDetalleAdmin();
  activarEliminar();
});
