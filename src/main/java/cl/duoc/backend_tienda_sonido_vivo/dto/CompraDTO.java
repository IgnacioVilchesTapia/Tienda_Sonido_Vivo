package cl.duoc.backend_tienda_sonido_vivo.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CompraDTO(
        @NotEmpty(message = "El carrito está vacío")
        List<@Valid ItemCompraDTO> items,

        String cupon,

        @NotNull(message = "La dirección de despacho es obligatoria")
        @Valid
        DireccionDTO direccion
) {
}
