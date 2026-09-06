
const regionesYcomunas = {
    "Región de Valparaíso": [
        "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", 
        "Concón", "San Antonio", "Quintero", "Casablanca"
    ],
    "Región Metropolitana": [
        "Santiago", "Providencia", "Ñuñoa", "Las Condes", 
        "Maipú", "Puente Alto", "La Florida", "Quilicura"
    ],
    "Región de Coquimbo": [
        "La Serena", "Coquimbo", "Ovalle", "Illapel"
    ],
    "Región del Biobío": [
        "Concepción", "Talcahuano", "Los Ángeles", "Chillán", "San Pedro de la Paz"
    ],
    "Región de La Araucanía": [
        "Temuco", "Padre Las Casas", "Villarrica", "Pucón"
    ]

};

document.addEventListener('DOMContentLoaded', () => {

    const selectRegion = document.getElementById('region');
    const selectComuna = document.getElementById('comuna');


    if (selectRegion && selectComuna) {
        

        selectRegion.innerHTML = '<option value="">Selecciona una región...</option>';
        
        for (const region in regionesYcomunas) {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            selectRegion.appendChild(option);
        }

    
        selectComuna.innerHTML = '<option value="">Primero selecciona una región...</option>';
        selectComuna.disabled = true;

     
        selectRegion.addEventListener('change', (evento) => {
            const regionSeleccionada = evento.target.value;
            
 
            selectComuna.innerHTML = '<option value="">Selecciona una comuna...</option>';
            
        
            if (regionSeleccionada !== "") {
                const comunas = regionesYcomunas[regionSeleccionada];
                
                // Rellenar las comunas correspondientes
                comunas.forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna;
                    option.textContent = comuna;
                    selectComuna.appendChild(option);
                });
                
              
                selectComuna.disabled = false;
            } else {
            
                selectComuna.innerHTML = '<option value="">Primero selecciona una región...</option>';
                selectComuna.disabled = true;
            }
        });
    }
});