package cl.duoc.backend_tienda_sonido_vivo.dto;

import jakarta.validation.constraints.NotBlank;

public record EstadoDTO(
        @NotBlank(message = "El estado es obligatorio")
        String estado
) {
}
