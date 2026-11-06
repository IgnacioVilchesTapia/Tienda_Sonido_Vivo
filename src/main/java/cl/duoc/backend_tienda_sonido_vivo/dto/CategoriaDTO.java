package cl.duoc.backend_tienda_sonido_vivo.dto;

import cl.duoc.backend_tienda_sonido_vivo.model.Categoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaDTO(
        Long id,

        @NotBlank(message = "El nombre de la categoría es obligatorio")
        @Size(max = 60, message = "El nombre tiene máximo 60 caracteres")
        String nombre
) {

    public static CategoriaDTO desde(Categoria c) {
        return new CategoriaDTO(c.getId(), c.getNombre());
    }
}
