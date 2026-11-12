package cl.duoc.backend_tienda_sonido_vivo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DireccionDTO(
        @NotBlank(message = "La calle es obligatoria")
        @Size(max = 150) String calle,

        @Size(max = 50) String depto,

        @NotBlank(message = "La región es obligatoria")
        @Size(max = 60) String region,

        @NotBlank(message = "La comuna es obligatoria")
        @Size(max = 60) String comuna,

        @Size(max = 300) String indicaciones
) {
}
