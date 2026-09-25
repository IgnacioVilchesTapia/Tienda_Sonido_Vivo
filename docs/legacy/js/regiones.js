
const REGIONES = [
  { nombre: "Región de Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
  { nombre: "Región de Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica", "Huara"] },
  { nombre: "Región de Antofagasta", comunas: ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "San Pedro de Atacama"] },
  { nombre: "Región de Atacama", comunas: ["Copiapó", "Caldera", "Vallenar", "Chañaral", "Huasco"] },
  { nombre: "Región de Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña"] },
  { nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón", "Quillota", "San Antonio", "Los Andes"] },
  { nombre: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Ñuñoa", "Las Condes", "Maipú", "Puente Alto", "La Florida", "San Joaquín", "Recoleta", "Macul"] },
  { nombre: "Región del Libertador General Bernardo O'Higgins", comunas: ["Rancagua", "San Fernando", "Santa Cruz", "Pichilemu", "Machalí"] },
  { nombre: "Región del Maule", comunas: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "Longaví"] },
  { nombre: "Región de Ñuble", comunas: ["Chillán", "Chillán Viejo", "San Carlos", "Quirihue", "Bulnes"] },
  { nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante", "San Pedro de la Paz", "Coronel"] },
  { nombre: "Región de La Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Victoria"] },
  { nombre: "Región de Los Ríos", comunas: ["Valdivia", "La Unión", "Río Bueno", "Panguipulli", "Lanco"] },
  { nombre: "Región de Los Lagos", comunas: ["Puerto Montt", "Osorno", "Castro", "Ancud", "Puerto Varas"] },
  { nombre: "Región de Aysén del General Carlos Ibáñez del Campo", comunas: ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"] },
  { nombre: "Región de Magallanes y de la Antártica Chilena", comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"] }
];

/**
 * Conecta un select de región con uno de comuna.
 * Al cambiar la región se vuelve a poblar el select de comunas.
 * @param {string} idRegion  id del <select> de región
 * @param {string} idComuna  id del <select> de comuna
 * @param {string} [comunaInicial] comuna que debe quedar seleccionada (modo editar)
 */
function conectarRegionComuna(idRegion, idComuna, comunaInicial) {
  const selRegion = document.getElementById(idRegion);
  const selComuna = document.getElementById(idComuna);
  if (!selRegion || !selComuna) return;

  // Poblar regiones
  selRegion.innerHTML = '<option value="">Selecciona una región</option>';
  REGIONES.forEach(function (r) {
    const opcion = document.createElement("option");
    opcion.value = r.nombre;
    opcion.textContent = r.nombre;
    selRegion.appendChild(opcion);
  });

  function cargarComunas() {
    const region = REGIONES.find(function (r) { return r.nombre === selRegion.value; });
    selComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
    selComuna.disabled = !region;
    if (!region) return;
    region.comunas.forEach(function (c) {
      const opcion = document.createElement("option");
      opcion.value = c;
      opcion.textContent = c;
      selComuna.appendChild(opcion);
    });
  }

  selRegion.addEventListener("change", cargarComunas);
  cargarComunas();

  if (comunaInicial) {
    selComuna.value = comunaInicial;
  }
}
