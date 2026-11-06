package cl.duoc.backend_tienda_sonido_vivo.exception;

public record ErrorRespuesta(int status, String error, String mensaje, String ruta) {
}
