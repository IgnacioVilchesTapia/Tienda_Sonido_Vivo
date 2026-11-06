package cl.duoc.backend_tienda_sonido_vivo.dto;

import cl.duoc.backend_tienda_sonido_vivo.model.Usuario;
import java.time.LocalDate;

public record UsuarioDTO(
        String run,
        String nombre,
        String apellidos,
        String correo,
        String rol,
        String region,
        String comuna,
        String direccion,
        LocalDate nacimiento
) {

    public static UsuarioDTO desde(Usuario u) {
        return new UsuarioDTO(
                u.getRun(),
                u.getNombre(),
                u.getApellidos(),
                u.getCorreo(),
                u.getRol().name(),
                u.getRegion(),
                u.getComuna(),
                u.getDireccion(),
                u.getFechaNacimiento()
        );
    }
}
