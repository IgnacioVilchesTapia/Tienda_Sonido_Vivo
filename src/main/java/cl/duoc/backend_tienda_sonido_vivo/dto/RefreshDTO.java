package cl.duoc.backend_tienda_sonido_vivo.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshDTO(
        @NotBlank(message = "El refresh token es obligatorio")
        String refreshToken
) {
}
