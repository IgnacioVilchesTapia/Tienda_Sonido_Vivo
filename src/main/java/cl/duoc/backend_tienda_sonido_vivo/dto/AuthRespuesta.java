package cl.duoc.backend_tienda_sonido_vivo.dto;

public record AuthRespuesta(String token, String refreshToken, UsuarioDTO usuario) {
}
