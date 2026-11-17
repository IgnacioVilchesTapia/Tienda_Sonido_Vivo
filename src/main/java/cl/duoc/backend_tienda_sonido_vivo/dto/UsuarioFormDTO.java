package cl.duoc.backend_tienda_sonido_vivo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UsuarioFormDTO(
        String run,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 50, message = "El nombre tiene máximo 50 caracteres")
        String nombre,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(max = 100, message = "Los apellidos tienen máximo 100 caracteres")
        String apellidos,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato válido")
        @Size(max = 100, message = "El correo tiene máximo 100 caracteres")
        String correo,

        String password,

        String rol,

        @Size(max = 60) String region,
        @Size(max = 60) String comuna,
        @Size(max = 300) String direccion,
        LocalDate nacimiento
) {
}
